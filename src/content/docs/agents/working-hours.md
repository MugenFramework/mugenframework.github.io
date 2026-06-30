---
title: Working Hours & Kill Date
description: Restricting agent activity to a time window and setting an expiry date.
---

Both Demon and Tengu support time-based controls that restrict when the agent operates. They are configured differently depending on the agent.

---

## Tengu (Linux)

For Tengu, kill date and working hours are **configured at payload generation time** in the payload builder UI. They are compiled into the agent config and cannot be changed at runtime.

- **Kill Date** - enter a date in `YYYY-MM-DD` format. The agent terminates itself after midnight on that date.
- **Working Hours** - enter a range like `8:00-18:00`. The agent sleeps outside that window and does not check in.

Both fields are optional. Leave blank to disable.

---

## Demon (Windows)

For Demon, working hours and kill date can be set at payload generation time **or** updated at runtime from the session console.

### Working Hours

Working hours limit the agent to a specific daily time window. Outside that window the agent sleeps and does not check in.

#### Set from the session console

```
sleep workinghours <start_hour> <end_hour>
```

Example - active only between 09:00 and 18:00:

```
sleep workinghours 9 18
```

The agent checks in normally during the window and goes dark outside it. Hours are in 24h format based on the **target machine's local time**.

#### Remove working hours

```
sleep workinghours 0 24
```

---

### Kill Date

A kill date causes the agent to terminate itself after a given date. Useful to ensure implants don't run indefinitely after an engagement ends.

#### Set from the session console

```
sleep killdate <YYYY-MM-DD>
```

Example:

```
sleep killdate 2026-12-31
```

After midnight on the kill date, the agent exits its main loop and terminates.

---

## Notes

- The kill date and working hours are evaluated against the **target machine's local time**.
- Working hours and kill date can be used together on both agents.
- For Demon: once set at runtime, the kill date persists across reboots (stored in agent config). There is no "unset" - set a new kill date to extend.
