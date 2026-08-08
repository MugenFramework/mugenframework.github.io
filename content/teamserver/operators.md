---
title: Operators
description: Managing operator accounts on the Mugen teamserver.
---

Operators are the users who connect to the teamserver via the client. Each operator needs a username and a password defined in the profile before they can log in.

---

## Profile block

```hcl
Operators {
    operator "alice" {
        Password = "hunter2"
    }
    operator "bob" {
        Password = "changeme"
    }
}
```

The label after `operator` is the username the client must enter at login. You can define as many operators as needed.

---

## Authentication

When a client connects, it sends the username and a SHA3-256 hash of the password over the encrypted WebSocket. The teamserver looks up the username, hashes the stored password the same way, and compares. If they match, the connection is accepted.

Passwords are never stored or transmitted in plaintext.

---

## Shared session

All connected operators share the same view of the teamserver in real-time:

- Same agent list
- Same listener list
- Same loot and task history
- All commands and output from any operator are visible to all others

There is no role system - every operator has full access.

---

## Considerations for team ops

- Use a unique username per person so logs are attributable.
- Change passwords between engagements.
- The profile file contains credentials in plaintext - restrict read access to it (`chmod 600 mugen.yaotl`).
- Operators can only connect while the teamserver is running with that profile loaded. Restarting with a different profile drops all existing sessions.
