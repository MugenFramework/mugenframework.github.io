---
title: Network Recon
description: Network reconnaissance commands for the Tengu agent.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

All commands parse `/proc/net/*` directly - no external binary required.

---

## netstat

```
netstat
```

Lists TCP and TCP6 connections parsed from `/proc/net/tcp` and `/proc/net/tcp6`. Shows local address, remote address, and connection state.

---

## arp

```
arp
```

ARP table from `/proc/net/arp`. Shows IP, hardware type, flags, MAC address, and interface.

---

## route

```
route
```

Routing table from `/proc/net/route`. Shows interface, destination, gateway, flags, and metric.

---

## ifconfig

```
ifconfig
```

Network interfaces and their IPv4/IPv6 addresses, parsed from the kernel via `getifaddrs`.

---

## portscan

```
portscan <target> <ports> [timeout_ms]
```

TCP connect scan, no external binary. Supports single IPs, CIDR ranges, port lists, and port ranges.

```
portscan 10.0.0.1 22,80,443
portscan 192.168.1.0/24 22,80,443,8080 500
portscan 10.10.10.5 1-1024
```

Default timeout: 500ms per port. Lower timeout for faster sweeps on local networks.
