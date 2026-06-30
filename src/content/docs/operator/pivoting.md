---
title: Pivoting
description: SMB pivoting between Demon agents over named pipes.
---

Mugen supports SMB-based pivoting to chain agents through internal networks using Windows named pipes.

---

## How it works

A **pivot agent** runs on an intermediate host and relays traffic between the teamserver and a deeper agent over a named pipe. No direct HTTP connectivity is required from the deep host to the teamserver.

```
Teamserver <--HTTP--> Pivot (DMZ host) <--SMB pipe--> Deep agent (internal host)
```

---

## Setup

### 1. Create an SMB listener

In the profile or via **View -> Listeners -> Add -> SMB**:

```hcl
Listeners {
    Smb {
        Name     = "smb-pivot"
        PipeName = "mugen_pipe"
    }
}
```

### 2. Generate an SMB payload

Generate a Demon payload targeting the SMB listener. Deploy and execute it on the internal host.

### 3. Connect from a pivot session

From an existing Demon session on the intermediate host:

```
pivot connect <ip_or_hostname> <pipe_name>
```

Example:

```
pivot connect 10.10.10.50 mugen_pipe
```

On success, the internal agent appears in the session table linked to its parent pivot.

---

## Pivot commands

| Command | Description |
|---|---|
| `pivot connect <ip> <pipe>` | Connect to an SMB agent |
| `pivot list` | List all active pivot connections |
| `pivot disconnect <agent_id>` | Disconnect from a pivot agent |

Disconnecting does **not** kill the remote agent process - it stays alive and waits for a reconnection.

---

## Session graph

**View -> Session Graph** shows the full chain visually with parent/child arrows between pivot sessions.
