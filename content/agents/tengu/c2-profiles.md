---
title: C2 Profiles
description: Transport configuration for Tengu - HTTP/HTTPS, DNS, DoH, and TCP.
---

Tengu supports four transports selected at build time. All of them use ChaCha20 application-layer encryption after the initial registration.

---

## Transports

| Transport | ID | Description |
|---|---|---|
| **HTTP / HTTPS** | 0 (default) | Standard HTTP POST to the configured URI |
| **DNS** | 1 | TXT record polling, frames encoded as base32 in QNAME labels |
| **DoH** | 2 | DNS-over-HTTPS, same DNS protocol over HTTPS POST `/dns-query` |
| **TCP** | 3 | Raw TCP socket, used when pivoting through a parent agent |

---

## HTTP / HTTPS

The default transport. Tengu sends a POST request to the configured C2 host and URI on each beacon.

### Configurable options

| Option | Description |
|---|---|
| **Hosts** | One or more C2 hostnames or IPs |
| **Port** | Connection port (default: 80 for HTTP, 443 for HTTPS) |
| **URI** | Request path (e.g. `/updates`, `/cdn/assets/bundle.js`) |
| **User-Agent** | `User-Agent` header value |
| **Sleep / Jitter** | Beacon interval and randomisation percentage |
| **Kill date** | Agent exits after this date (`YYYY-MM-DD`) |
| **Working hours** | Beacon window (`HH:MM-HH:MM`), agent sleeps outside it |
| **HTTP Proxy** | `http://[user:pass@]host:port` for HTTP traffic |
| **HTTPS Proxy** | Same, for HTTPS traffic |

If no proxy is configured at build time, Tengu falls back to `HTTP_PROXY` / `HTTPS_PROXY` environment variables at runtime. Both NTLM and Basic auth are supported via libcurl `CURLAUTH_ANY`.

### HTTPS

TLS is handled by libcurl on the agent side. For production use, point the agent to a hostname with a valid certificate (or a redirector that terminates TLS).

---

## DNS

Tengu polls TXT records from the configured domain. Each frame is split into base32-encoded chunks embedded in QNAME labels. Responses are returned as TXT record values.

Useful when HTTP is blocked but outbound DNS is not. Higher latency than HTTP.

---

## DNS-over-HTTPS (DoH)

Same DNS protocol as the DNS transport but sent over HTTPS POST to `/dns-query`. Traffic looks like standard DoH traffic to a resolver (e.g. Cloudflare, Google). Useful when raw DNS is also blocked.

---

## TCP

Raw TCP socket transport. Used exclusively for pivot chaining: a Tengu agent compiled with TCP connects to a parent Tengu agent that has HTTP/HTTPS C2 reach. The parent relays the child's traffic to the teamserver.

The parent agent must be listening:

```
pivot tcp listen <port>
```

The child is compiled with the TCP transport pointing to the parent's IP and port.

---

## Application-layer encryption

All four transports encrypt the body of every packet with **ChaCha20** using a 32-byte session key.

The key is generated at build time, embedded in the binary config, and sent to the teamserver in the INIT packet. After the INIT, all subsequent packets (including over plain HTTP) are encrypted.

Wire format (agent to teamserver):

```
[header: 12 bytes][nonce: 12 bytes][ChaCha20(body)]
```

Wire format (teamserver to agent):

```
[nonce: 12 bytes][ChaCha20(payload)]
```

This means traffic is end-to-end encrypted regardless of whether TLS is used. A passive observer on an HTTP listener sees only ciphertext.
