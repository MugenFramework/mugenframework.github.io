---
title: Privilege Escalation
description: Privilege escalation reconnaissance for the Tengu agent.
---

---

## privesc

```
privesc
```

One-shot local privilege escalation survey. No arguments. Checks:

- **Writable PATH directories** - checks every `$PATH` entry for world-writable permissions
- **sudo -l** - sudo rules for the current user (non-interactive, no password prompt)
- **SUID/SGID binaries** - scans `/usr/bin`, `/usr/sbin`, `/bin`, `/sbin`, `/usr/local/bin`, `/usr/local/sbin`, `/opt`
- **Processes with capabilities** - reads `CapEff` from `/proc/<pid>/status` for all accessible processes

Cross-reference results with [GTFOBins](https://gtfobins.github.io/).
