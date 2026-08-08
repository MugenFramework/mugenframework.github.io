---
title: C2 Profiles
description: HTTP/HTTPS and SMB transport configuration for Demon - listeners, URIs, headers, TLS, proxy, and pivoting.
---

Demon supports two built-in transports: **HTTP/HTTPS** and **SMB named pipe**. The transport is selected at build time; a compiled Demon binary uses exactly one transport.

---

## HTTP / HTTPS listener

The HTTP listener is the primary internet-facing transport. HTTPS is the same listener with TLS enabled.

### Listener fields

| Field | Description |
|---|---|
| **Name** | Internal label for the listener (shown in the teamserver UI) |
| **Bind host** | IP/interface the teamserver listens on |
| **Bind port** | Port the teamserver listens on |
| **Hosts** | One or more C2 hostnames or IPs the implant will call back to |
| **Port (conn)** | Port the implant connects to (may differ from bind port behind a redirector) |
| **Method** | HTTP verb: `GET` or `POST` |
| **URIs** | One or more URI paths (e.g. `/updates`, `/cdn/assets/bundle.js`) |
| **Host header** | `Host:` header value to send with every request (for CDN/domain-fronting) |
| **User-Agent** | `User-Agent` header value |
| **Headers** | Additional arbitrary HTTP headers (`Header: Value` per line) |
| **Host rotation** | `round-robin` or `random` - cycling strategy when a host fails |
| **Behind redirector** | When enabled, the teamserver trusts `X-Forwarded-For` |
| **Kill date** | Unix timestamp (UTC) after which the implant exits |
| **Working hours** | Time window (`HH:MM-HH:MM`) outside which the implant sleeps |

### HTTPS / TLS

Enable **Secure** to use TLS. Two options:

- **Self-signed**: Mugen generates a certificate automatically at listener start.
- **Custom cert/key**: Provide PEM paths in the listener config. Required for production deployments; browsers and proxies will flag self-signed certificates.

TLS termination happens at the teamserver. If you use a redirector (nginx, Apache, Caddy), terminate TLS there and forward plain HTTP to the teamserver on a loopback port.

### Proxy support

Demon can route egress traffic through a proxy. Configured at build time via the builder UI, it can also be updated at runtime:

```
config proxy <type> <host> <port> [username] [password]
```

| Proxy type | Example |
|---|---|
| `http` | Corporate HTTP proxy |
| `socks5` | SOCKS5 proxy |

If no explicit proxy is configured, Demon automatically discovers the system proxy via WinHTTP (`WinHttpGetIEProxyConfigForCurrentUser`).

### Host rotation

When multiple `Hosts` are configured, Demon cycles between them on connection failure.

| Strategy | Behaviour |
|---|---|
| **round-robin** | Try hosts in order; advance after `HostMaxRetries` consecutive failures |
| **random** | Pick a random host each time |

A host is marked **dead** after `HostMaxRetries` consecutive failures. If all hosts are dead, Demon stops checking in and waits until the next sleep cycle to try again.

### Request anatomy

Every check-in is a single HTTP request. The body is AES-256 encrypted with a session key negotiated during the initial handshake.

```
POST /cdn/assets/bundle.js HTTP/1.1
Host: cdn.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...
X-Custom-Header: value
Content-Type: application/octet-stream

<AES-256 encrypted body>
```

The teamserver responds with the job queue, also AES-256 encrypted. If there are no pending jobs the response body is empty (just a 200 OK).

### Recommended redirector setup

```
Internet → nginx/Caddy (TLS, profile match) → teamserver (127.0.0.1:<bind-port>)
```

Use URI-based filtering in the redirector to forward only requests that match your configured URIs; drop everything else with a 404 or redirect to a legitimate site. This keeps the teamserver invisible to scanners.

---

## SMB named pipe (pivot transport)

The SMB listener enables **peer-to-peer chaining**: a Demon on a network segment without direct internet access connects to a sibling Demon that does have C2 reach, using a Windows named pipe over SMB.

### Listener fields

| Field | Description |
|---|---|
| **Name** | Internal label |
| **Pipe name** | Named pipe path (e.g. `\\.\pipe\msagent_ee3f`) |
| **Kill date** | Same as HTTP |
| **Working hours** | Same as HTTP |

### How it works

1. A "parent" Demon (with HTTP/HTTPS C2 reach) connects to a "child" Demon's named pipe via [`pivot smb connect`](/agents/demon/commands/#pivot-smb-connect).
2. The child Demon was generated with `TRANSPORT_SMB` and is waiting for a pipe connection.
3. Once connected, the teamserver routes traffic for the child through the parent's HTTP session.
4. The child appears as a separate agent in the client UI, nested under the parent.

Named pipes traverse SMB (TCP 445). Useful in environments where workstations can reach each other but not the internet directly.

### Pipe name recommendations

The default pipe name is randomised by the builder (e.g. `msagent_<hex>`). To blend with the environment, use names matching legitimate Windows services:

- `\pipe\svcctl`
- `\pipe\wkssvc`
- `\pipe\srvsvc`

Custom pipe names can be set in the listener config before building.

---

## TCP pivot

The TCP pivot is similar to SMB but uses raw TCP instead of named pipes. Useful when SMB (port 445) is blocked between hosts but other TCP ports are open.

| Field | Description |
|---|---|
| **Pivot host** | IP the parent Demon connects to (the child's IP) |
| **Pivot port** | TCP port the child listens on |

See [`pivot tcp listen`](/agents/demon/commands/#pivot-tcp-listen) and [`pivot tcp connect`](/agents/demon/commands/#pivot-tcp-connect) for runtime usage.

---

## Profile tips

### Blending with legitimate traffic

- Set `User-Agent` to a real browser UA matching the target environment.
- Use URIs that look like static assets: `/js/app.bundle.js`, `/assets/logo.png`.
- Add a `Referer` header pointing to a plausible origin site.
- Keep `sleep` high during business hours to match expected traffic bursts.

### CDN / domain fronting

Set `Host` (listener host) to a CDN IP or hostname you control, and set `Host header` to the fronted domain. The CDN forwards traffic to the teamserver based on the `Host:` header the implant sends.

### Kill date and working hours

Both constraints are enforced on the implant side (no teamserver required). If the kill date passes, or a check-in is attempted outside working hours, Demon sleeps until the next valid window or exits if past the kill date.
