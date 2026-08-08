---
title: Pivoting & Networking
description: SMB/TCP pivots, SOCKS5 proxy, and reverse port forwarding for the Demon agent.
---

## pivot list

```
pivot list
```

Lists all connected pivot children.

---

## pivot connect

```
pivot connect <host> <agent-id>
```

Connects to a Demon child listening on an SMB named pipe.

```
pivot connect HOST-DC agent_6d6e
```

---

## pivot disconnect

```
pivot disconnect <agent-id>
```

Disconnects an SMB pivot.

---

## pivot tcp

```
pivot tcp listen <port>
pivot tcp disconnect <agent-id>
```

TCP pivot sub-commands.

| Subcommand | Behaviour |
|---|---|
| `listen <port>` | Opens a TCP server on the current host for incoming pivot connections |
| `disconnect <agent-id>` | Disconnects a TCP pivot child |

---

## socks add

```
socks add <port>
```

Starts a SOCKS5 proxy server on the specified port. Traffic is tunnelled through the implant to the target network.

---

## socks list

```
socks list
```

Lists all active SOCKS5 proxy servers.

---

## socks kill

```
socks kill <port>
```

Stops and removes a SOCKS5 proxy server.

---

## socks clear

```
socks clear
```

Stops and removes all SOCKS5 proxy servers.

---

## rportfwd add

```
rportfwd add <bind-host> <bind-port> <forward-host> <forward-port>
```

Creates a reverse port forward: the teamserver listens on `bind-host:bind-port` and forwards connections through the implant to `forward-host:forward-port`.

```
rportfwd add 0.0.0.0 8080 192.168.1.1 4444
```

---

## rportfwd list

```
rportfwd list
```

Lists all active reverse port forwards.

---

## rportfwd remove

```
rportfwd remove <socket-id>
```

Closes and removes a specific reverse port forward by socket ID.

---

## rportfwd clear

```
rportfwd clear
```

Closes and removes all reverse port forwards.
