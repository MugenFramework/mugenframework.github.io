---
title: OPSEC
description: Evasion techniques built into Demon - sleep obfuscation, syscalls, AMSI/ETW bypass, injection, and more.
---

Demon was not designed to bypass AV or EDR products out of the box - and that is intentional. Mugen does not play the cat-and-mouse game with vendors. Demon is built to be malleable and modular so operators can adapt it using their own loaders, packers, crypters, and stagers. The primitives documented here are a baseline - not a guarantee of evasion against any specific product.

This page documents the evasion primitives built into Demon. Each technique can be configured at build time (in the payload builder) or adjusted at runtime with the [`config` command](/agents/demon/commands/#config).

---

## API resolution

Demon resolves **all** Win32 and Native API functions at runtime from the PEB. There are no static imports and no IAT entries. The loader walks the in-memory module list (`PEB->Ldr`), hashes each export name with a custom algorithm, and matches against compile-time constants.

This means:

- `dumpbin /exports demon.dll` shows no suspicious imports.
- Import-scanning tools (PE-Sieve, Moneta, AV import heuristics) find nothing.
- Any API can be resolved from any DLL without touching the disk.

---

## Indirect syscalls

When `SysIndirect` is enabled (default), Demon never calls NT functions directly. Instead:

1. It locates the `syscall; ret` gadget inside `ntdll.dll` at runtime.
2. For each NT call, it sets up arguments normally and then jumps to the gadget instead of calling the function's entry point.

The result: the CPU's call stack shows a return address inside `ntdll`, not inside the implant. ETW kernel tracing and stack-based EDR telemetry see a legitimate call chain.

Toggle at runtime:

```
config inject-technique 2   # Syscall (default)
config inject-technique 1   # Win32 (no indirect syscall)
```

---

## Sleep obfuscation

During sleep, Demon encrypts its own memory to defeat in-memory scanning tools (PE-Sieve, Moneta, BeaconEye, Yara rules). Three techniques are available.

### Ekko (default)

ROP-based sleep using `RtlCreateTimerQueue` and `SystemFunction032` (XOR encrypt):

1. Sets up a ROP chain on the current thread's stack.
2. Queues a timer that fires after the sleep interval.
3. The ROP chain: `RtlCaptureContext` → encrypt memory → `WaitForSingleObject` → decrypt memory → restore context.

Memory is XOR-encrypted with a random key while the timer is pending. No new threads are created.

### Zilean

Timer-based sleep using `RtlRegisterWait`:

1. Registers a wait object on an event with the sleep timeout.
2. The callback encrypts/decrypts memory around the wait.

Similar to Ekko but uses a different timer API path, offering variation against signature-based detection.

### Foliage

`NtWaitForSingleObject`-based sleep:

1. Creates an alertable wait on the main thread.
2. Queues an APC that encrypts memory, then sleeps.
3. A second APC decrypts and signals completion.

Uses alertable waits (APC-based) rather than timer queues.

### Configuring the technique

In the builder UI, select the technique before generating the payload. To change it at runtime:

```
config sleep-technique 1   # Ekko
config sleep-technique 2   # Zilean
config sleep-technique 3   # Foliage
config sleep-mask off       # Disable entirely (plaintext in memory during sleep)
```

---

## Call stack duplication

Before sleeping, Demon duplicates its current call stack into a fresh stack frame that looks like a legitimate thread (e.g. a worker thread blocked on `WaitForSingleObject` inside `ntdll`). On wake, the real stack is restored.

This defeats stack-inspection tools that look for implant code in call frames.

The **thread start address** can also be spoofed to point to a legitimate function:

```
config thread-start-addr kernelbase.dll BaseThreadInitThunk
```

Similarly, injection threads can have their start address spoofed:

```
config inject-spoof-addr ntdll.dll RtlUserThreadStart
```

---

## AMSI and ETW bypass

Demon can disable AMSI (Anti-Malware Scan Interface) and ETW (Event Tracing for Windows) using one of two methods.

### Method 1: HWBP (Hardware Breakpoints) - recommended

Uses the CPU debug registers (DR0-DR3) to intercept calls to `AmsiScanBuffer` and `NtTraceEvent`. When the patched function is called, a hardware breakpoint fires, and Demon's vectored exception handler intercepts the call and returns a clean result.

- No memory patches. The functions remain unmodified on disk and in memory.
- Bypasses integrity-checking tools that scan for patched bytes.

Set in the builder or at runtime:

```
config amsi-etw hwbp
```

The HWBP engine is implemented in `src/core/HwBpEngine.c`.

### Method 2: Memory patch

Patches the first bytes of `AmsiScanBuffer` and `NtTraceEvent` with a `ret` instruction (classic AMSI patch). Simple and effective but leaves detectable byte-level indicators.

```
config amsi-etw patch
```

### Disable

```
config amsi-etw none
```

---

## Proxy loading (DLL injection into sacrifice process)

The **Proxy Loading** option controls how Demon's reflective DLL is executed in the sacrifice process during fork-and-run operations. Three NT API paths are available:

| Option | API used |
|---|---|
| `RtlRegisterWait` | `RtlRegisterWait` (NT timer) |
| `RtlCreateTimer` | `RtlCreateTimer` + `RtlCreateTimerQueue` |
| `RtlQueueWorkItem` | `RtlQueueWorkItem` (thread pool) |

These are alternatives to the obvious `CreateRemoteThread`/`NtCreateThreadEx` paths that EDRs monitor closely.

---

## Memory allocation

Controls how Demon allocates RWX/RW memory for injected code.

| Mode | API | Notes |
|---|---|---|
| **NtAllocate (default)** | `NtAllocateVirtualMemory` | Called via indirect syscall; no `VirtualAllocEx` in call stack |
| **Win32** | `VirtualAllocEx` | Standard Win32 path; simpler but more monitored |

```
config memory-alloc 1   # NtAllocate
config memory-alloc 2   # VirtualAllocEx
```

---

## Injection techniques

Controls how Demon writes shellcode into a remote process and triggers execution.

| Technique | Write API | Execute API | Notes |
|---|---|---|---|
| **Win32** (1) | `WriteProcessMemory` | `CreateRemoteThread` | Baseline; heavily monitored |
| **Syscall** (2, default) | `NtWriteVirtualMemory` | `NtCreateThreadEx` | Indirect syscalls; harder to hook |
| **APC** (3) | `NtWriteVirtualMemory` | `NtQueueApcThread` | Early-bird APC injection; fires before process entry point |

```
config inject-technique 1   # Win32
config inject-technique 2   # Syscall
config inject-technique 3   # APC
```

---

## BOF execution modes

### Threaded BOF (default)

BOFs run in a new thread, registered as a background job. The beacon thread is not blocked. The new thread's start address is spoofed.

### VEH (Vectored Exception Handler)

Installs a VEH before running the BOF. If the BOF triggers an exception (common with BOFs that call NT APIs that return errors), the VEH catches it and reports it back rather than crashing the implant.

```
config coffee-threaded on
config coffee-veh on
```

---

## Fork-and-run (spawn mode)

Operations that cannot safely run in the implant process (shellcode injection, some BOFs, `dotnet inline-execute`) can be run in a sacrificial process spawned for the purpose.

The spawn process defaults to `%windir%\System32\notepad.exe`. Change it to a process that is expected in the target environment:

```
config spawn64 C:\Windows\System32\svchost.exe -k netsvcs -p
config spawn32 C:\Windows\SysWOW64\notepad.exe
```

---

## DLL export randomisation

The builder patches the reflective DLL's export function name with a random string at build time. The default Havoc export (`ReflectiveLoader`), a well-known IOC, is never present in a Mugen payload.

The random name is re-generated each time you click **Generate** in the builder.

---

## Summary matrix

| Technique | Default | Configurable at runtime |
|---|---|---|
| Indirect syscalls | On | Yes (`inject-technique`) |
| Sleep obfuscation | Ekko | Yes (`sleep-technique`) |
| Sleep masking | On | Yes (`sleep-mask`) |
| Stack duplication | On | - |
| Thread start address spoof | Off | Yes (`thread-start-addr`) |
| Inject start address spoof | Off | Yes (`inject-spoof-addr`) |
| AMSI/ETW bypass | HWBP | Yes (`amsi-etw`) |
| Memory allocation | NtAllocate | Yes (`memory-alloc`) |
| BOF threaded execution | On | Yes (`coffee-threaded`) |
| BOF VEH | Off | Yes (`coffee-veh`) |
| DLL export randomisation | On | Build time only |
| PEB-based API resolution | On | - |
