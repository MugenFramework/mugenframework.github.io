---
title: Sessions
description: Managing and annotating agent sessions.
---

## Session table

The session table shows all active and dead agents. Each row displays:

| Column | Description |
|---|---|
| ID | Unique agent identifier (`TU-` for Tengu, `DN-` for Demon) |
| Alias | Operator-assigned human-readable name, shown next to the ID |
| External | External IP address |
| Internal | Internal IP address |
| User | Operator context the agent runs as |
| Computer | Hostname of the target |
| OS | Operating system |
| Process | Process name and PID |
| Last | Last check-in timestamp |
| Health | Live countdown to next expected beacon |
| Tags | Operator-assigned labels |

## Interacting with a session

Double-click any session to open its console. Type `help` for available commands.

The prompt shows who ran the command and the task status (`[queued]`, `[sent]`, `[done]`, `[error]`). For a live view of every task across all agents, see [Tasks](/operator/tasks/).

For Demon sessions, use the full Havoc-compatible command set.
For Tengu sessions, see [Tengu commands](/agents/tengu/).

## Agent alias

Working from raw IDs like `TU-1a2b3c4d` gets old fast on a large engagement. Right-click a session and select **Set Alias** to give it a short human-readable name, e.g. `dc01-system`.

The alias appears in its own `ALIAS` column next to the ID. Saving an empty alias clears it.

Console tabs follow the alias: `[dc01-system] user/host` when one is set, `[TU-xxxx] user/host` otherwise. Changing or clearing the alias updates an already-open console tab immediately.

Aliases are stored **on the teamserver**:

- every operator sees the same alias, as soon as it is set
- it survives client reconnects and teamserver restarts
- aliases are capped at 32 characters; control characters are stripped

Aliases are labels, not identifiers - nothing stops two agents from sharing one, and commands still target the agent ID.

## Notes and tags

Right-click a session and select **Notes_Tags** to annotate it.

- **Tags** - comma-separated labels (e.g. `dc, high-value, owned`). Shown in the `TAGS` column.
- **Notes** - free-form text (newlines allowed).

Like aliases, notes and tags are stored **on the teamserver**:

- every operator sees the same values as soon as they are saved
- they survive client reconnects and teamserver restarts
- tags are capped at 256 characters, notes at 4096; control characters are stripped
- saving empty tags or notes clears them

Local notes written by older clients are not migrated automatically.

The session table filter accepts `tag:` and `notes:`.

## Health indicator

The health column shows a live countdown updated every second based on the agent's last check-in time and its configured sleep interval.

| State | Display | Color |
|---|---|---|
| Alive, next beacon soon | `● next 23s` / `● next 2m 14s` | Green |
| Late | `● late +12s` / `● late +1m 5s` | Red |
| Off-hours | `● off-hours` | Yellow |
| Dead | `● dead` | Red |

Dead sessions remain in the table for reference and loot access.

## Filter bar

A query bar above the session table lets you filter sessions in real time. All tokens are AND-combined.

### Named field filters

```
type:TU           Tengu agents only
type:DN           Demon agents only
health:live       Alive agents
health:late       Late / unresponsive agents
health:dead       Dead agents
user:root         Sessions running as root
user:john         Sessions for a specific user
ip:10.0           External or internal IP containing "10.0"
computer:DC01     By hostname
os:ubuntu         By OS string
proc:bash         By process name
listener:C2       By listener name
id:tg-1ba8        By partial agent ID
alias:dc01        By agent alias
tag:owned         By session tag
notes:dc          By note text
```

### Plain text

Text without a colon is matched against all visible columns as well as the listener name and agent type:

```
root              matches any column containing "root"
10.0.0            matches any column containing "10.0.0"
```

### Examples

```
type:TU user:root              Tengu sessions running as root
type:TU health:live ip:10.0    Live Tengu on the 10.0.x.x range
user:root health:live          All live root sessions (Tengu + Demon)
type:DN health:late            Demon sessions that are late
```

All matching is case-insensitive and partial. Clearing the filter instantly restores all rows.

## Session graph

**View → Session View → Graph** shows a visual map of all sessions with their parent/child relationships (useful for SMB pivots and lateral movement chains).

## Desktop notifications

Mugen shows a system tray notification whenever a new agent checks in. The notification displays the agent type, username, hostname, and external IP. Requires a running notification daemon (supported on all major Linux desktop environments).

## Dashboard

**View → Dashboard** shows live counts of active Tengu, active Demon, dead agents, and total sessions, updated every second. Also includes recent credentials and recent downloads tables.
