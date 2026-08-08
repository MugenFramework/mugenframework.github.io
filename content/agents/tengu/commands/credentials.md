---
title: Credential Access
description: Credential harvesting commands for the Tengu agent.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## harvest

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

---

## procdump

```
procdump <pid>
procdump all
```

Reads `/proc/<pid>/mem` directly (no ptrace, no process pause) and scans readable memory regions for credential patterns: passwords, secrets, tokens, AWS keys, JWTs, PEM blocks, Authorization headers.

```
procdump 1234      # scan a specific PID
procdump all       # scan all accessible processes
```

Access to other users' processes requires root or `ptrace_scope=0`. Reading your own processes always works.

---

## keylog

```
keylog [seconds]
```

Captures keystrokes for N seconds. Default: 30 seconds.

```
keylog 60
keylog          # 30s default
```

Tries `/dev/input/eventX` first (requires `input` group or root). Falls back to X11 via `dlopen("libX11.so.6")` - works for any user with a graphical session without recompiling.
