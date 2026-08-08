---
title: Processes
description: Process management commands for the Demon agent.
---

## proc list

```
proc list
```

Full process list: PID, PPID, name, session, architecture, and owner.

---

## proc kill

```
proc kill <pid>
```

Terminates a process.

---

## proc create

```
proc create <state> [--silent] [--no-pipe] <executable> [args]
```

Starts a new process.

| `state` | Effect |
|---|---|
| `suspended` | Process is created suspended (`CREATE_SUSPENDED`) |
| `normal` | Process starts immediately |

```
proc create suspended --no-pipe C:\Windows\System32\notepad.exe
```

---

## proc modules

```
proc modules <pid>
```

Lists all DLLs loaded in a process (name, base address, size).

---

## proc grep

```
proc grep <name>
```

Searches for a running process by name (case-insensitive, partial match).

---

## proc memory

```
proc memory <pid> <protection>
```

Returns all memory regions in a process that match a given protection mask.

```
proc memory 1337 PAGE_EXECUTE_READWRITE
```

Valid masks: `PAGE_READ`, `PAGE_READWRITE`, `PAGE_EXECUTE`, `PAGE_EXECUTE_READ`, `PAGE_EXECUTE_READWRITE`

---

## screenshot

```
screenshot
```

Captures a screenshot of every monitor and sends the image to the loot manager.
