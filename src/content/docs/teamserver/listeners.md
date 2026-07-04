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

## DNS

DNS listeners receive agent check-ins over DNS TXT queries. Useful when direct HTTP/HTTPS is blocked but DNS traffic is allowed outbound.

Frames are base32-encoded and split across QNAME labels. The agent polls a configured domain by issuing TXT queries. The teamserver runs a custom DNS server that responds with encoded task data.

### Creating via UI

1. **View -> Listeners -> Add**
2. Select **DNS**
3. Configure the domain the agent will poll (e.g. `c2.example.com`)
4. Set the bind interface and port (default: UDP 53)

The DNS server must be authoritative for the configured domain. Point the domain's NS record to the teamserver IP.

---

## DoH (DNS-over-HTTPS)

Same DNS protocol as the DNS listener, delivered over HTTPS POST to `/dns-query` with `Content-Type: application/dns-message`. Blends in with standard DoH traffic.

The agent uses the configured DoH endpoint URL. The teamserver answers standard RFC 8484 DNS-wire-format queries.

---

## TCP

TCP listeners accept inbound TCP connections from agents. Used when pivoting: a Demon agent on Windows acts as the parent and a child Tengu or Demon agent connects back to it over TCP, then relays traffic to the teamserver.

The child agent connects outbound to the parent's TCP port. No HTTP is used - raw binary framing over the socket.

This is the recommended transport for Windows -> Linux lateral movement chains.

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
