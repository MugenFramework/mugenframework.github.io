---
title: Pivoting
description: SMB pivoting between Demon agents over named pipes.
---

Mugen supports two pivoting methods: SMB named pipes (Windows-to-Windows) and TCP transport (Windows Demon to Linux Tengu).

---

## SMB pivot (Demon -> Demon)

A **pivot agent** runs on an intermediate host and relays traffic between the teamserver and a deeper agent over a Windows named pipe. No direct HTTP connectivity is required from the deep host to the teamserver.

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

---

## TCP pivot (Demon -> Tengu)

A Windows Demon agent can act as a TCP relay for a Linux Tengu child. The Tengu payload is compiled with the **TCP transport** and points to the parent Demon's listening port. Traffic flows: teamserver -> Demon (Windows) -> Tengu (Linux) over a raw TCP socket.

```
Teamserver <--HTTP--> Demon (Windows) <--TCP--> Tengu (Linux)
```

### Setup

1. Create a **TCP listener** via **View -> Listeners -> Add -> TCP**
2. Generate a Tengu payload targeting that TCP listener
3. Deploy the Tengu payload on the Linux target - it connects back to the Demon agent's TCP port
4. The Demon agent relays the traffic to the teamserver automatically

No commands are needed on the Demon side - relay happens transparently once the TCP listener is configured.

---

## Session graph

**View -> Session Graph** shows the full chain visually with parent/child arrows between pivot sessions.
