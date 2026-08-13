---
title: Tasks
description: Live task status across every agent.
---

**View → Ops → Tasks** is a live table of every command issued on the teamserver. Use it to see what is waiting on the next beacon, what is running, and what already came back — without opening each agent console.

## Status

| Status | Meaning |
|---|---|
| `queued` | Task is sitting in the agent's job queue, waiting for the next check-in |
| `sent` | The job was handed to the agent on this check-in |
| `processing` | Output has started (e.g. a download that just began) |
| `completed` | A result came back |
| `error` | The command failed |

The agent console shows the same states as a colour badge on the prompt: `[queued]`, `[sent]`, `[processing]`, `[done]`, `[error]`.

Duration is measured from the moment the task was queued to completion (or live, while it is still in progress).

## Columns

| Column | Description |
|---|---|
| STATUS | Current state |
| AGENT | Session ID (`TU-` / `DN-`) |
| ALIAS | Operator-assigned name, if any |
| TYPE | Tengu or Demon |
| OPERATOR | Who issued the command |
| COMMAND | Command line |
| TIME | When it was queued (UTC) |
| DURATION | Elapsed time |

The table keeps the last 500 tasks. Double-click a row to open that agent's console.

## Filters

The dropdown limits the table to **All**, **In progress** (queued / sent / processing), **Completed**, or **Error**.

The search bar uses the same query language as the session table. Tokens are AND-combined.

```
status:queued
agent:TU-
alias:dc01
type:Tengu
user:alice
```

Plain text matches any column:

```
whoami
10.0.0
```

Examples:

```
status:queued type:Tengu     Tengu commands still waiting for a beacon
user:alice in-progress       (use the dropdown) Alice's unfinished work
agent:TU-1a2b                everything for one session
```
