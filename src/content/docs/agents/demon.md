---
title: Demon - Windows Agent
description: Flagship Windows implant written in C and ASM.
---

Demon is the primary Windows agent. It is written in C and x64 ASM and provides a rich post-exploitation capability set.

## Evasion

| Feature | Details |
|---|---|
| Sleep obfuscation | Ekko (default), Ziliean, FOLIAGE - encrypt implant memory during sleep |
| Stack duplication | Copy and restore the call stack during sleep to defeat stack-scanning |
| Heap encryption | Encrypt implant heap alongside stack duplication |
| Indirect syscalls | All Nt\* API calls go through dynamically resolved syscall stubs |
| Return address spoofing | x64 - spoof return addresses for scanner detection evasion |
| AMSI/ETW bypass | Hardware breakpoint-based - no in-memory patching, harder to detect |
| Proxy library loading | Load DLLs without touching LoadLibrary |

## Commands

### Information gathering

| Command | Description |
|---|---|
| `whoami` | Current user, groups, privileges |
| `ps` | Process list |
| `env` | Environment variables |
| `screenshot` | Capture desktop screenshot |

### File system

| Command | Description |
|---|---|
| `ls [path]` | List directory |
| `cd <path>` | Change directory |
| `cat <file>` | Read file |
| `download <path>` | Download file to client |
| `upload <local> <remote>` | Upload file to target |
| `mkdir <path>` | Create directory |
| `rm <path>` | Delete file or directory |
| `cp <src> <dst>` | Copy file |

### Execution

| Command | Description |
|---|---|
| `shell <cmd>` | Execute via cmd.exe |
| `powershell <cmd>` | Execute via PowerShell |
| `run <executable>` | Execute a binary |
| `inline-execute <bof> [args]` | Execute a BOF (Beacon Object File) in-process |
| `dotnet inline-execute <asm> [args]` | Execute a .NET assembly in-process |
| `shellcode inject <pid>` | Inject shellcode into a process |

### Lateral movement

| Command | Description |
|---|---|
| `jump psexec <target> <share>` | PSExec-style lateral movement |
| `jump wmi <target>` | WMI execution |
| `pivot smb <target>` | Connect to an SMB agent |

### Token management

The token vault stores stolen tokens for later use across the session.

| Command | Description |
|---|---|
| `token getuid` | Print current user ID |
| `token list` | List stored tokens |
| `token find-tokens` | Find stealable tokens on the system |
| `token steal <pid> [handle]` | Steal token from a process |
| `token impersonate <id>` | Impersonate a stored token |
| `token make <domain> <user> <pass>` | Create a token from credentials |
| `token privs-get` | Acquire all privileges from the current token |
| `token privs-list` | List current token privileges |
| `token revert` | Revert to the original process token |
| `token remove <id>` | Remove a token from the vault |
| `token clear` | Clear all tokens from the vault |

### Process management

| Command | Description |
|---|---|
| `proc list` | List running processes |
| `proc kill <pid>` | Kill a process |
| `proc create <state> <process> [args]` | Start a process (`suspended` or `normal`) |
| `proc module <pid>` | List modules loaded in a process |
| `proc grep <name>` | Search for a running process by name |
| `proc memory <pid> <protection>` | Query memory pages with a given protection |

### Job management

Long-running tasks (injection, BOF, keylogger, etc.) run as background jobs. Active jobs prevent sleep obfuscation.

| Command | Description |
|---|---|
| `job list` | List running jobs |
| `job suspend <id>` | Suspend a job |
| `job resume <id>` | Resume a suspended job |
| `job kill <id>` | Kill a job |

### Networking

| Command | Description |
|---|---|
| `socks5 start [port]` | Start SOCKS5 proxy |
| `socks5 stop` | Stop SOCKS5 proxy |
| `rportfwd add <lport> <rhost> <rport>` | Reverse port forward |

### Sleep

```
sleep <seconds> [jitter%]
```

Example: `sleep 30 20` - 30 second interval, 20% jitter.

When sleep masking is enabled and no jobs are running, Demon encrypts its memory and applies the configured obfuscation technique before sleeping. x64 Demon uses return address spoofing during sleep.

## BOF execution

Demon supports [Beacon Object Files](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/beacon-object-files_main.htm) via `inline-execute`:

```
inline-execute /path/to/bof.x64.o [args]
```

Arguments are packed using the Havoc/CS packing format. See [Writing Modules](/python-api/modules/) for how to call `inline-execute` from a Python script.

## Sleep configuration

```
sleep <seconds> [jitter%]
```

Example: `sleep 30 20` - 30 seconds with 20% jitter.
