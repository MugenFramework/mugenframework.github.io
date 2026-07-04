---
title: "Mugen v0.1 - The Fragrant Flower Blooms With Dignity"
description: "Announcing the first public release of Mugen: a community continuation of Havoc GPL-3.0, with a new Linux agent, multi-transport C2, sleep obfuscation, per-build artifact randomization, and a full operator UI."
date: "2026-07-04"
author: "bbuddha"
---

On February 20, 2026, the Havoc C2 framework repository was archived. The last open-source GPL-3.0 commit became a frozen snapshot.

Mugen is a community continuation of that codebase - forked from the last public Havoc GPL-3.0 commit, with a new identity, a new Linux agent, and features built on top of the foundation C5pider created. The goal is not to replace Havoc or compete with anything. It is to keep an open, community-driven version alive. C5pider validated the publication of this fork before release. Credits are in the README.

Today is the first public release: **v0.1 - The Fragrant Flower Blooms With Dignity**.

---

## The ecosystem

Mugen is not just the framework. The MugenFramework organization ships five repositories:

- [**Mugen**](https://github.com/MugenFramework/Mugen) - the framework itself: teamserver, Qt5 client, Demon (Windows), Tengu (Linux)
- [**Modules**](https://github.com/MugenFramework/Modules) - Python module collection ported from HavocFramework/Modules: SituationalAwareness BOFs, RemoteOps, PowerPick, InvokeAssembly, nanorobeus (Kerberos), Delegation, DomainInfo, SamDump, and more - all load in Mugen without modification
- [**havoc-py**](https://github.com/MugenFramework/havoc-py) - Python SDK for the Service API WebSocket, used to build custom agents and ExternalC2 integrations
- [**Talon**](https://github.com/MugenFramework/Talon) - reference implementation of a custom Windows agent using the Service API; the simplest possible working example of `havoc-py` in action
- [**Karasu**](https://github.com/MugenFramework/Karasu) - the same thing for Linux: a minimal C agent + Python handler showing how to integrate a custom Linux agent through the Mugen Service API

Karasu is something we built from scratch for this release. While Talon covers the Windows side, there was no equivalent example for Linux - Karasu fills that gap. If you want to build a custom Linux agent that talks to Mugen without using Tengu, Karasu is the starting point.

---

## What Mugen is

Mugen (無限 - "infinite") is a post-exploitation C2 framework. It has a teamserver written in Go, a Qt5 client, a Windows agent (Demon, inherited from Havoc), and a new Linux agent (Tengu). Everything that worked in Havoc still works in Mugen. Everything new is on top of that.

The rebrand is complete. The Python module is now `mugen` - `import havoc` still works for compatibility. The UI has a new dark manga theme with sakura pink accents. Agent IDs are prefixed: `DN-` for Demon, `TU-` for Tengu.

---

## Tengu - a Linux agent built from scratch

The headline feature of v0.1 is **Tengu** (天狗), a Linux implant written in C with no external dependencies on the target. No curl, no Python, no Go runtime. The binary links against what it needs and talks to the teamserver over its own protocol.

Tengu is not a port of Demon. The two agents share a teamserver and a client, but the implant code, command set, and transport layer are independent.

### Identity and environment

```
whoami /all    # uid/euid, groups, capabilities, sudo rights, TTY, home, shell
id             # uid/gid/groups, concise
env            # environment variables
pwd
```

### File system

```
ls [path]   cd <path>   cat <path>   download <path>   upload <local> <remote>
mkdir <path>   rm [-r] <path>   cp <src> <dst>   chmod <octal> <path>
```

### Process management

```
ps      # /proc enumeration, no binary
kill <pid>
```

### Network recon

Parsed entirely from `/proc` - no `netstat`, no `ip`, no `arp` binary required:

```
netstat     # TCP/TCP6 from /proc/net/tcp and /proc/net/tcp6
arp         # ARP table from /proc/net/arp
route       # routing table from /proc/net/route
ifconfig    # interfaces and addresses
```

And a built-in port scanner:

```
portscan 192.168.1.0/24 22,80,443,8080 500
portscan 10.10.10.5 1-1024
```

TCP connect scan, 64 parallel connections, supports single IPs and CIDR ranges. No nmap. No binary at all.

### Execution

```
shell <cmd>                    # /bin/sh -c
inline-execute bof.o [args]    # ELF BOF, in-process, no fork
memfd /tools/linpeas.sh        # in-memory ELF via memfd_create, zero disk writes
screenshot                     # scrot (X11) / grim (Wayland) / import (ImageMagick)
```

`memfd` uploads a local ELF to the agent and executes it entirely in memory using `memfd_create` + `/proc/self/fd/<n>`. The process appears in `/proc` with the name `kworker/u:0`. Zero bytes are written to disk on the target.

### Credential access

```
harvest       # SSH keys, AWS/GCP/Azure tokens, shell history, git, docker, kube, pgpass, shadow
procdump all  # scan /proc/<pid>/mem for passwords, JWTs, AWS keys, Bearer tokens
keylog 60     # raw evdev + X11 fallback, 60 seconds, no binary
```

`procdump` reads process memory via `/proc/<pid>/mem` with `pread`. No ptrace, no process suspension, nothing in `ps`. Most EDRs instrument `ptrace(2)` syscalls - `/proc` reads do not generate those events. See the [ELF BOF article](/blog/linux-elf-bof) for a full working credential scanner BOF using the same technique.

### Persistence

```
persist cron /path/to/agent [interval]    # crontab, default */5 * * * *
persist systemd /path/to/agent            # .service unit (root: /etc/systemd/system/, user: ~/.config/systemd/user/)
persist bash /path/to/agent               # nohup entry in ~/.bashrc, dedup-safe
```

### Privilege escalation recon

```
privesc
```

One-shot local survey. No arguments. Checks:

- **SUID/SGID binaries** in `/usr/bin`, `/usr/sbin`, `/bin`, `/sbin`, `/usr/local/bin`
- **`sudo -l`** - non-interactive, no password prompt
- **Writable PATH directories** - every directory in `$PATH` checked for world-writable permissions
- **Process capabilities** - `CapEff` from `/proc/<pid>/status` for all accessible processes

No LinPEAS download, no subprocess, no disk artifact. Cross-reference findings with [GTFOBins](https://gtfobins.github.io/).

### Tunneling

```
socks5 start [port]                          # SOCKS5 proxy over the C2 channel, default 1080
rportfwd add <bind_port> <host> <port>       # reverse port forward without SOCKS5
rportfwd list
rportfwd rm <bind_port>
```

`rportfwd` exposes an internal service to the operator through the C2 channel. The teamserver opens a TCP listener on `bind_port` - when an operator connects, the agent connects to `host:port` and relays traffic bidirectionally over the C2 HTTP channel. No SOCKS5 client required.

```
# Expose an SSH server reachable only from the agent
rportfwd add 2222 192.168.10.5 22
ssh -p 2222 user@<teamserver_ip>
```

---

## Four transports

Every Tengu payload is compiled against exactly one transport.

**HTTP/HTTPS** - standard POST check-ins to a configurable URI list. User-Agent and URI rotation list are set at build time and embedded in the agent config. HTTPS uses the configured teamserver certificate.

**DNS** - frames base32-encoded across QNAME labels, received as TXT record responses. Reliable where outbound HTTP is blocked but recursive DNS is allowed outbound. The teamserver runs a custom authoritative DNS server - point the domain's NS record to the teamserver IP.

**DNS-over-HTTPS** - same DNS framing over HTTPS POST to `/dns-query` with `Content-Type: application/dns-message`. Indistinguishable from standard DoH traffic to any deep-packet inspection system. Works on networks that intercept HTTP/S but allow DoH resolvers.

**TCP** - raw socket for lateral movement chains. A Demon agent on a compromised Windows host listens on a configured TCP port. The Tengu payload on the Linux host connects back to it. Traffic flows: teamserver → Demon (Windows) → Tengu (Linux). No direct connectivity required from the Linux host to the teamserver.

All four transports share the same **ChaCha20 application-layer encryption**. A 32-byte key is generated at payload build time and embedded in the agent config. After the initial registration, every frame is encrypted regardless of the transport layer - even over plain HTTP.

---

## Proxy support

HTTP proxy configured at build time, with runtime fallback:

- Set `HTTP_PROXY` / `HTTPS_PROXY` in the payload builder - the proxy URL is compiled into the agent config
- If no proxy is configured at build time, Tengu reads `HTTP_PROXY` and `HTTPS_PROXY` environment variables at runtime

Both NTLM and Basic auth are supported via libcurl `CURLAUTH_ANY`. Demon gets the same treatment. Useful for environments where all traffic is required to go through an authenticated corporate proxy.

---

## Per-build artifact randomization

Each payload build generates a unique binary. Three values are randomized at build time using `crypto/rand`:

**DEMON_MAGIC_VALUE** - the 4-byte value that identifies Demon check-ins is regenerated per server instance. Static signatures looking for `0xDEADBEEF` stop matching.

**djb2 HASH_KEY** - the key used to hash Windows API names for dynamic resolution is regenerated per payload build. The hash table is different every time.

**DLL export function name** - Demon ships as a DLL. In vanilla Havoc the exported entry point is always named `Start`. In Mugen, the builder generates a random identifier (letter + 6 alphanumeric characters) and passes it as `EXPORT_FUNC_NAME` to the compiler. YARA rules matching `.export == "Start"` stop working.

---

## Sleep obfuscation for Tengu

During each sleep interval, Tengu XOR-encrypts its own `r-x` code pages.

The mechanism: at sleep time, the agent reads `/proc/self/maps` to find its own executable segments, generates a 32-byte random key per sleep, then XOR-encrypts those pages byte by byte through `mprotect(PROT_NONE)`. A helper thread holds pre-resolved function pointers for `nanosleep`, `mprotect`, `sem_post`, and `sem_wait` - resolved at startup via `dlsym` and stored on the heap. The thread needs these because the PLT (which normally handles library calls) lives inside the encrypted region and would fault after encryption.

The obfuscation functions themselves are bounded by `obf_start` and `obf_end` marker functions placed at the top and bottom of a dedicated source file. At runtime, their page-aligned addresses define a skip range excluded from encryption.

Between check-ins, the agent binary is unreadable in memory. In-memory scanners looking for ELF magic bytes or known code sequences find nothing.

Falls back to plain `sleep()` silently if any setup step fails.

## String obfuscation for Tengu

Sensitive strings in the Tengu binary are encrypted at compile time using a per-build XOR key.

The builder generates a random key byte with `crypto/rand`, pre-encrypts every target string (`/proc/self/maps`, `/proc/self/exe`, `nanosleep`, `mprotect`, `sem_post`, `sem_wait`, `/dev/urandom`), and writes a header (`obfstr_data.h`) with the encrypted bytes as C array initializers. This header is injected at compile time via `gcc -include`. The `SXOR` macro (a GCC statement expression, unique static local per call site via `__COUNTER__`) decrypts each string on first use and caches the result in a static buffer.

Strings do not appear in plaintext in the binary. `strings` on the binary output is clean.

---

## Client UI

The v0.1 client ships with a full set of operator UI features built on top of the Havoc base:

**Theme switcher** - Mugen dark theme (sakura pink accent, ink black background) and Havoc Classic (Dracula), switchable from the navbar, persisted across sessions via QSettings.

**Dashboard** - four stat cards (Tengu Live, Demon Live, Dead, Total), last 8 credentials, last 8 downloads. Updated every second.

**Map view** - world map with geolocated agents using ip-api.com. Live sessions in pink, dead sessions in grey. Hover for details.

**Session health countdown** - every row in the session table shows a live timer to the next expected check-in, color-coded green (on time) / red (late) / yellow (off-hours) / grey (dead).

**Console search** - Ctrl+F opens an inline search bar with match highlighting, forward/backward navigation, and a `n/total` counter. Escape to close.

**Session table filter** - real-time query bar with named fields and plain-text fallback:

```
type:TU user:root health:live    # Tengu sessions running as root, currently alive
type:DN health:late ip:10.0      # Demon sessions late on the 10.0.x.x range
```

Fields: `type:`, `user:`, `ip:`, `computer:`, `os:`, `proc:`, `health:`, `listener:`, `id:`. All tokens are AND-combined, all matching is case-insensitive.

**Session notes and tags** - right-click any session, annotate with free-form notes and comma-separated tags. Tags appear as a column in the session table. Persisted in SQLite across client restarts.

**Loot Manager** - three tabs: Screenshots (inline viewer with zoom and save), Downloads, Credentials. Credentials include type, username, secret, domain, source, agent, and timestamp. Add/Edit/Remove via a centered button bar. Everything persists across server restarts.

**Desktop notifications** - system tray icon with a toast notification on every new agent check-in.

**Session graph edge labels** - edges in the session graph show the listener name and transport type (e.g. `http01 [HTTPS]`, `beacon [DNS]`, `tcp01 [TCP]`). Pivot edges show `pivot`.

**Live privilege escalation detection** - when `whoami` on a Tengu session detects an euid change, the session table username and session graph node update immediately without a reconnect.

**Explorer UI** - Process List and File Explorer tabs available for both Demon and Tengu sessions, accessible from the session panel.

---

## ELF BOF loader

Tengu executes x86_64 ELF relocatable objects in-process via `inline-execute`. Same concept as Cobalt Strike/Havoc BOFs on Windows, but for Linux. No fork, no subprocess, no disk artifact. The BeaconAPI interface is compatible - the same function names, the same packing format.

The loader maps the `.o` file (`.text`, `.rodata`, `.data`, `.bss`) into a single RWX region, applies all RELA relocations, resolves BeaconAPI symbols against the internal table and anything else via `dlsym(RTLD_DEFAULT)`, then calls `go(args, args_len)`.

The interesting part is handling `PLT32` relocations in PIE binaries. Tengu loads at `0x555555...`, anonymous mmap allocations land at `0x7f...`. The distance can exceed 2 GB, overflowing a signed 32-bit PC-relative offset and causing a SIGSEGV on the first BeaconAPI call. The loader detects this and writes 12-byte trampolines inside the BOF mapping:

```asm
mov rax, <abs64_target>   ; 48 B8 <8 bytes>
jmp rax                   ; FF E0
```

The call instruction patches to jump to the trampoline, which jumps to the real 64-bit address. Same mechanism the Linux kernel uses for out-of-range module calls.

See the [ELF BOF deep dive](/blog/linux-elf-bof) for a full walkthrough, including a working in-memory credential scanner BOF using `/proc/<pid>/mem`.

---

## Python API

The Python module is `mugen`. `import havoc` is aliased to it at startup - all existing HavocFramework/Modules load without modification. `Packer` is available globally in all scripts without import.

**Session classes:**

```python
demon = Demon(agentID)        # Demon (Windows) session
tengu = mugen.Tengu(agentID)  # Tengu (Linux) session
```

`mugen.Tengu` was added specifically to fix a crash that occurred when calling `Demon` on a Tengu session - `DemonCommands` is null for Linux agents, so the dispatch table lookup faulted. The two classes share the same interface (`ConsoleWrite`, `Command`, `InlineExecute`) but dispatch through different internal tables.

**Command registration:**

```python
# Demon session command
RegisterCommand(func, module, command, description, 0, usage, example)

# Tengu session command - two equivalent forms
RegisterTenguCommand(func, module, command, description, 0, usage, example)
RegisterCommand(func, module, command, description, 0, usage, example, agent="Tengu")
```

**Credentials from scripts:**

```python
mugen.AddCredential(
    agent_id  = agentID,
    cred_type = "ssh-key",
    username  = "alice",
    secret    = key_content,
    domain    = tengu.Computer,
    source    = "~/.ssh/id_rsa"
)
```

Credentials are written to the Loot Manager immediately and persisted in SQLite.

**Module auto-loader** - drop any `.py` file in `~/.mugen/modules/` and it loads at every client startup. No manual script manager steps needed for your regular tooling.

The [Modules](https://github.com/MugenFramework/Modules) repository ships SituationalAwareness, RemoteOps, PowerPick, InvokeAssembly, nanorobeus, Delegation, DomainInfo, SamDump and more - all working out of the box.

---

## Custom agents via the Service API

The Service API lets you integrate a completely custom agent. The teamserver handles session management, tasking, and output display. You implement the agent logic, transport, and a Python handler using [havoc-py](https://github.com/MugenFramework/havoc-py).

The handler connects to the teamserver via WebSocket, registers the agent type, receives operator tasks, and forwards agent responses. Any transport works - the teamserver does not care how bytes get to the agent.

Two reference implementations are available:

**[Talon](https://github.com/MugenFramework/Talon)** - minimal custom Windows agent in C + Python handler. The simplest possible working example of the Service API on the Windows side.

**[Karasu](https://github.com/MugenFramework/Karasu)** - same thing for Linux. A minimal C agent + Python handler showing the full integration cycle on a Linux target. Karasu (烏 - "crow") is something we built for this release. It covers the gap that existed in the original Havoc ecosystem - there was no Linux equivalent of Talon.

If you want to build your own agent, start with whichever matches your target OS and extend from there.

---

## Kill date and working hours

Both Demon and Tengu support time-based controls configured at payload generation:

- **Kill date** - the agent terminates itself after midnight on the configured date. Ensures implants do not run indefinitely after an engagement ends.
- **Working hours** - the agent sleeps outside the configured time window and does not check in.

For Demon these can also be updated at runtime from the session console. For Tengu they are compiled into the agent config at build time.

---

## What is next

v0.2 focuses on network evasion and Demon improvements.

On the network side: malleable C2 profiles for Tengu (configurable HTTP headers, URI patterns, User-Agent per profile), JA3/JA3S fingerprint randomization, and domain fronting.

On the Demon side: sleep callback obfuscation (Foliage/Cronos style - timer callbacks instead of thread suspension), ChaCha20 application-layer encryption for Demon frames to match what Tengu already has, and in-memory .NET assembly execution.

The full roadmap is at [/roadmap](/roadmap/).

---

## Getting started

Build instructions are in [Getting Started](/getting-started/installation/). The framework is available on GitHub under GPL-3.0.

All five repos are under the [MugenFramework](https://github.com/MugenFramework) organization.
