---
title: Processes
description: Process listing and management for the Tengu agent.
---

---

## ps

```
ps
```

Lists all processes via `/proc` enumeration. Returns PID, PPID, username, and process name. Does not require any external binary.

---

## kill

```
kill <pid>
```

Sends `SIGKILL` to the specified process.

```
kill 1337
```
