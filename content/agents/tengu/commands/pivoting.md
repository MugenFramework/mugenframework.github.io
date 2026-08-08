---
title: Pivoting & Networking
description: SOCKS5 proxy, reverse port forwarding and TCP pivot for the Tengu agent.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## socks5 start

```
socks5 start [port]
```

Starts a SOCKS5 proxy tunnelled through the C2 channel. Default port: `1080`. Traffic from the proxy is forwarded through the implant into the target network.

---

## socks5 stop

```
socks5 stop
```

Stops the active SOCKS5 proxy.

---

## rportfwd add

```
rportfwd add <bind_port> <internal_host> <internal_port>
```

Creates a reverse port forward: the teamserver opens a TCP listener on `bind_port` and forwards connections through the implant to `internal_host:internal_port` on the target network.

```
# Expose an internal SSH server
rportfwd add 2222 192.168.10.5 22
ssh -p 2222 user@<teamserver_ip>

# Expose an internal web app
rportfwd add 8080 10.0.0.100 80
```

Multiple rules can be active simultaneously.

---

## rportfwd list

```
rportfwd list
```

Lists all active reverse port forwards.

---

## rportfwd rm

```
rportfwd rm <bind_port>
```

Closes and removes a reverse port forward by bind port.

---

## pivot tcp listen

```
pivot tcp listen <port>
```

Opens a TCP server on the agent host that accepts connections from child Tengu agents compiled with the TCP transport. Once connected, the teamserver routes traffic for the child through this agent's C2 session.

```
pivot tcp listen 8445
```
