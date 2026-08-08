---
title: Jobs & Transfers
description: Background job and file transfer management for the Demon agent.
---

Long-running tasks (shellcode injection, BOF, etc.) run as background jobs. Active jobs suppress sleep obfuscation.

## job list

```
job list
```

Lists all running and suspended jobs with their ID, type, and status.

---

## job suspend

```
job suspend <id>
```

Suspends a background job.

---

## job resume

```
job resume <id>
```

Resumes a suspended job.

---

## job kill

```
job kill <id>
```

Terminates a job and frees associated resources.

---

## task list

```
task list
```

Lists all commands queued for the agent but not yet executed.

---

## task clear

```
task clear
```

Clears all pending commands from the task queue.

---

## transfer list

```
transfer list
```

Lists active downloads/uploads with ID, path, progress, and speed.

---

## transfer stop

```
transfer stop <file-id>
```

Pauses a transfer.

---

## transfer resume

```
transfer resume <file-id>
```

Resumes a paused transfer.

---

## transfer remove

```
transfer remove <file-id>
```

Cancels and removes a transfer.
