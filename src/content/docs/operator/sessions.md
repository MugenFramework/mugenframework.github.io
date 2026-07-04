---
title: Sessions
description: Managing and annotating agent sessions.
---

## Session table

The session table shows all active and dead agents. Each row displays:

| Column | Description |
|---|---|
| ID | Unique agent identifier (`tg-` for Tengu, `dm-` for Demon) |
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

For Demon sessions, use the full Havoc-compatible command set.
For Tengu sessions, see [Tengu commands](/agents/tengu/).

## Notes and tags

Right-click a session and select **Notes & Tags** to annotate it.

- **Tags** - comma-separated labels (e.g. `dc,highvalue,owned`). Displayed in the session table.
- **Notes** - free-form text. Persisted in the local SQLite database.

Notes and tags survive client restarts and are restored automatically on the next check-in.

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
