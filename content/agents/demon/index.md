---
title: Demon
description: Overview of the Demon Windows agent.
---

> Demon is the default Windows agent for the Mugen C2 framework.

Demon is written in C and x64 ASM, compiled with MinGW, and runs on Windows 7 / Server 2008 R2 and later (x64). It ships as a reflective DLL, a standalone EXE, or a Windows Service binary.

## Key features

- File system operations (ls, cat, upload, download, mkdir, rm, cp, mv)
- Process management (list, kill, create, module list, memory scan)
- Token manipulation and tracking
- BOF (Beacon Object File) execution via CoffeeLdr
- .NET assembly execution
- Shellcode injection (spawn / inject / execute modes)
- Token steal and impersonation
- Network recon via Win32 APIs (no LDAP)
- Kerberos operations (klist, pass-the-ticket, purge)
- SMB named pipe and TCP pivoting
- SOCKS5 proxy and reverse port forwarding
- Sleep obfuscation (Ekko, Zilean, Foliage)
- AMSI and ETW bypass via hardware breakpoints
- Indirect syscalls

## Credits

Demon is based on [Havoc](https://github.com/HavocC2/Havoc) by [@C5pider](https://twitter.com/C5pider), published under GPL-3.0. Mugen extends it with additional features and maintenance.

- [@0xbbuddha](https://github.com/0xbbuddha) - Mugen fork, additional features
