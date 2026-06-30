---
title: Listeners
description: Configuring HTTP, HTTPS, SMB and External C2 listeners.
---

Listeners receive agent check-ins and relay tasks. Open the listener manager via **View -> Listeners**.

---

## HTTP / HTTPS

The standard C2 channel. Agents send check-ins as POST requests and receive tasks in the response body.

### Creating via UI

1. **View -> Listeners -> Add**
2. Select **HTTP** or **HTTPS**
3. Fill in the fields and click **Save**

### Key fields

| Field | Description |
|---|---|
| Name | Listener identifier shown in the UI |
| Hosts | Comma-separated list of `host:port` pairs for agent rotation |
| Host (bind) | Interface to bind on (use `0.0.0.0` for all interfaces) |
| Port (bind) | Listening port |
| Port (conn) | Port agents connect to (can differ from bind when behind a redirector) |
| Secure | Enable TLS (HTTPS) |
| User-Agent | Filter check-ins by User-Agent header |
| URIs | URI rotation list - agents cycle through these per request |
| Headers | Extra response headers |
| Certificate / Key | PEM files for HTTPS |

### Host rotation

Set multiple hosts to rotate the C2 endpoint:

```
192.168.1.10:80, cdn.domain.com:443
```

Each check-in uses the next host in the list.

---

## SMB

SMB listeners use Windows named pipes for peer-to-peer communication between agents on the same host or network. Used for lateral movement and operating in environments where direct HTTP is blocked.

Requires Demon agents on both ends.

### Setup

1. Create an SMB listener with a pipe name:

```hcl
Listeners {
    Smb {
        Name     = "smb-pivot"
        PipeName = "mugen_pipe"
    }
}
```

2. Generate a Demon payload targeting the SMB listener
3. Execute the payload on the pivot host
4. From an existing session: `pivot connect <ip> <pipe_name>`

See [Pivoting](/operator/pivoting/) for full details.

---

## External C2

Allows a third-party process to act as the transport layer between the teamserver and an agent. Useful for custom protocols (DNS, ICMP, Slack, etc.).

See [External C2](/advanced/external-c2/) for the full integration guide.

---

## Listener status

The listener list shows each listener's name, type, host, port, and current status. A listener can be stopped and restarted without restarting the teamserver.
