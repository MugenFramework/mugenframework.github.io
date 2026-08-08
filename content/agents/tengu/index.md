---
title: Tengu
description: Overview of the Tengu Linux agent.
---

> Tengu is the Linux agent for the Mugen C2 framework.

Tengu is written in C, requires no external dependencies on the target, and runs as a single ELF64 binary. It supports HTTP/HTTPS, DNS, DNS-over-HTTPS, and TCP transports.

## Key features

- File system operations (ls, cat, upload, download, mkdir, rm, cp, chmod)
- Process management (list, kill)
- Shell and in-memory execution (shell, memfd)
- ELF BOF execution in-process (inline-execute)
- Network recon (netstat, arp, route, ifconfig, portscan)
- Credential harvesting (SSH keys, cloud tokens, shell history, /etc/shadow)
- Process memory scanning for credentials (procdump)
- Keylogger via /dev/input or X11
- Persistence (cron, systemd, bash)
- Privilege escalation recon (SUID, sudo, capabilities)
- Reverse port forwarding
- SOCKS5 proxy over C2 channel
- TCP pivot (parent-child chaining)
- Sleep obfuscation (XOR code pages during sleep)
- Compile-time string obfuscation

## Credits

- [@0xbbuddha](https://github.com/0xbbuddha) - author
