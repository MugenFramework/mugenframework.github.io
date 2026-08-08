---
title: Persistence
description: Persistence mechanisms for the Tengu agent.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## persist cron

```
persist cron <path> [interval]
```

Adds a crontab entry for the payload. Default interval: `*/5 * * * *` (every 5 minutes).

```
persist cron /tmp/.update
persist cron /home/user/.cache/helper "*/10 * * * *"
```

---

## persist systemd

```
persist systemd <path>
```

Creates a `.service` unit that starts the payload on boot and restarts it on failure.

- Root session: installs to `/etc/systemd/system/mugen-agent.service` and enables it system-wide.
- User session: installs to `~/.config/systemd/user/mugen-agent.service` and enables it for the current user.

```
persist systemd /home/user/.local/bin/helper
```

---

## persist bash

```
persist bash <path>
```

Appends a `nohup` launch entry to `~/.bashrc`. Dedup-safe: will not add the entry if the path is already present.

```
persist bash /home/user/.config/.update
```
