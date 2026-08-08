---
title: Commands
description: Command reference overview for the Demon agent.
---

All commands are entered in the agent console. Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

| Group | Commands | Description |
|---|---|---|
| [File System](/docs/agents/demon/commands/filesystem) | `ls` `cd` `pwd` `cat` `download` `upload` `mkdir` `rm` `cp` `mv` | Browse and transfer files |
| [Execution](/docs/agents/demon/commands/execution) | `shell` `powershell` `run` `inline-execute` `dotnet` `shellcode` `inject-dll` `spawn-dll` | Run commands, BOFs, .NET, shellcode |
| [Processes](/docs/agents/demon/commands/processes) | `ps` `proc list/kill/create/module/grep/memory` | List and manage processes |
| [Tokens](/docs/agents/demon/commands/tokens) | `token steal/impersonate/make/list/revert/...` | Token vault and impersonation |
| [Network Recon](/docs/agents/demon/commands/network-recon) | `net domain/logons/sessions/computer/dclist/share/user/group` | AD and network enumeration |
| [Kerberos](/docs/agents/demon/commands/kerberos) | `kerberos luid/klist/ptt/purge` | Ticket listing and pass-the-ticket |
| [Jobs & Transfers](/docs/agents/demon/commands/jobs) | `job list/suspend/resume/kill` `transfer list/stop/resume/remove` | Background jobs and file transfers |
| [Pivoting](/docs/agents/demon/commands/pivoting) | `pivot smb/tcp` `socks5` `rportfwd` | SMB/TCP pivots, SOCKS5, port forwards |
| [Config](/docs/agents/demon/commands/config) | `config` | Runtime implant configuration |
| [Sleep](#sleep) | `sleep` | Beacon interval and jitter |

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
