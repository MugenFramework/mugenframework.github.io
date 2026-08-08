---
title: Config
description: Runtime configuration command for the Demon agent.
---

Runtime configuration. Changes persist for the lifetime of the implant session.

```
config <key> [value]
```

| Key | Values | Description |
|---|---|---|
| `implant.verbose` | `true` / `false` | Enable/disable verbose logging (memory allocation, thread execution, etc.) |
| `implant.sleep-obf.technique` | `0` / `1` / `2` | Sleep obfuscation: 0=None, 1=Foliage, 2=Ekko (default) |
| `implant.sleep-obf.start-addr` | `lib!function+offset` | Custom thread start address during sleep obfuscation |
| `implant.coffee.veh` | `true` / `false` | Enable/disable VEH for BOF execution |
| `implant.coffee.threaded` | `true` / `false` | Enable/disable threaded BOF execution |
| `memory.alloc` | `1` / `2` | Memory allocation: 1=Win32 (VirtualAllocEx), 2=Native (NtAllocateVirtualMemory) |
| `memory.execute` | `1` / `2` | Thread creation: 1=Win32 (CreateRemoteThread), 2=Native (NtCreateThreadEx) |
| `inject.spoofaddr` | `lib!function+offset` | Spoof injection thread start address |
| `inject.spawn64` | `C:\path\to\exe.exe` | x64 sacrifice process for fork-and-run |
| `inject.spawn32` | `C:\path\to\exe.exe` | x86 sacrifice process for fork-and-run |
| `killdate` | `YYYY-MM-DD HH:MM:SS` | Update kill date (GMT 0). Set to `0` to disable |
| `workinghours` | `H:mm-H:mm` | Update working hours window. Set to `0` to disable |

### Examples

```
config implant.sleep-obf.technique 2       # Ekko
config implant.coffee.threaded true
config inject.spawn64 C:\Windows\System32\svchost.exe
config killdate 2026-12-31 23:59:59
config workinghours 8:30-19:00
config implant.sleep-obf.start-addr ntdll!LdrLoadLibrary+0x46
```
