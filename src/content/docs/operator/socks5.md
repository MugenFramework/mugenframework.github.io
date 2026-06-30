---
title: SOCKS5 Proxy
description: Tunneling traffic through an agent via SOCKS5.
---

Both Demon and Tengu support a SOCKS5 proxy tunneled over the C2 channel. This lets you route arbitrary TCP traffic (browsers, tools, scanners) through a compromised host without recompiling or redeploying the agent.

---

## Starting the proxy

### From a Demon session

```
socks5 start [port]
```

Default port: `1080`

```
socks5 start 9050
```

### From a Tengu session

```
socks5 start [port]
```

Same syntax, same default.

---

## Stopping the proxy

```
socks5 stop
```

---

## Using the proxy

Point any SOCKS5-aware tool at `127.0.0.1:<port>` on the operator machine.

### proxychains

```
# /etc/proxychains4.conf
socks5 127.0.0.1 1080
```

```bash
proxychains nmap -sT -Pn 10.10.10.0/24
proxychains crackmapexec smb 10.10.10.0/24
proxychains ssh user@10.10.10.50
```

### Browser

Configure the browser to use `SOCKS5 127.0.0.1:1080` as its proxy.

### curl

```bash
curl --socks5 127.0.0.1:1080 http://10.10.10.50/
```

---

## Notes

- The proxy listener binds on the operator machine (client side), not the teamserver.
- Traffic is relayed through the C2 channel - it follows the agent's sleep interval. Use a short sleep for interactive use.
- Multiple agents can each run their own proxy on different local ports.
- For Tengu, the proxy works over the existing HTTP C2 connection with no agent changes.
