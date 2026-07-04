---
title: Profiles
description: Teamserver configuration using the Yaotl profile format.
---

Mugen uses profile files written in **Yaotl** (a dialect of HCL) to configure the teamserver, operators, listeners, and agent behavior.

```bash
./mugen-server --profile myops.yaotl
```

---

## Full example

```hcl
Teamserver {
    Host = "0.0.0.0"
    Port = 40056

    Build {
        Compiler64 = "/usr/bin/x86_64-w64-mingw32-gcc"
        Compiler86 = "/usr/bin/i686-w64-mingw32-gcc"
        Nasm       = "/usr/bin/nasm"
    }
}

Operators {
    operator "alice" {
        Password = "changeme"
    }
    operator "bob" {
        Password = "changeme2"
    }
}

Listeners {
    Http {
        Name         = "http-main"
        Hosts        = ["192.168.1.10:80"]
        HostBind     = "0.0.0.0"
        PortBind     = "80"
        PortConn     = "80"
        Secure       = false
        UserAgent    = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        Uris         = ["/updates", "/cdn/static", "/api/v1/ping"]
        Headers      = ["X-Forwarded-For: 1.2.3.4", "Cache-Control: no-cache"]
    }
}

Demon {
    Sleep   = 5
    Jitter  = 20

    TrustXForwardedFor = false

    Injection {
        Spawn64 = "C:\\Windows\\System32\\notepad.exe"
        Spawn86 = "C:\\Windows\\SysWOW64\\notepad.exe"
    }
}

Service {
    Endpoint = "service-ws"
    Password = "service-password"
}

Webhook {
    Discord {
        Url = "https://discord.com/api/webhooks/..."
    }
}
```

---

## Blocks

### Teamserver

| Field | Type | Description |
|---|---|---|
| `Host` | string | Bind address for the client WebSocket |
| `Port` | int | Port for client connections |
| `Build.Compiler64` | string | Path to 64-bit cross-compiler |
| `Build.Compiler86` | string | Path to 32-bit cross-compiler |
| `Build.Nasm` | string | Path to nasm assembler |

### Operators

Each operator gets a named block with a `Password` field.

```hcl
Operators {
    operator "username" {
        Password = "password"
    }
}
```

### Listeners

Listeners defined in the profile are started automatically on server boot.

**HTTP/HTTPS fields:**

| Field | Type | Description |
|---|---|---|
| `Name` | string | Listener identifier |
| `Hosts` | list | Host rotation list (`"host:port"` format) |
| `HostBind` | string | Interface to bind on |
| `PortBind` | string | Listening port |
| `PortConn` | string | Port agents connect to (if different from bind) |
| `Secure` | bool | Enable TLS (HTTPS) |
| `UserAgent` | string | Expected User-Agent header from agents |
| `Uris` | list | URI rotation list |
| `Headers` | list | Custom response headers |
| `Cert` | string | Path to TLS certificate (HTTPS only) |
| `Key` | string | Path to TLS private key (HTTPS only) |

**DNS fields:**

```hcl
Listeners {
    Dns {
        Name     = "dns-main"
        Domains  = ["c2.example.com"]
        HostBind = "0.0.0.0"
        PortBind = "53"
    }
}
```

**DoH fields:**

```hcl
Listeners {
    Doh {
        Name     = "doh-main"
        Domains  = ["c2.example.com"]
        HostBind = "0.0.0.0"
        PortBind = "443"
        Cert     = "/path/to/cert.pem"
        Key      = "/path/to/key.pem"
    }
}
```

**TCP fields:**

```hcl
Listeners {
    Tcp {
        Name     = "tcp-pivot"
        HostBind = "0.0.0.0"
        PortBind = "4444"
    }
}
```

### Demon

| Field | Type | Description |
|---|---|---|
| `Sleep` | int | Default sleep in seconds |
| `Jitter` | int | Sleep jitter percentage |
| `TrustXForwardedFor` | bool | Log `X-Forwarded-For` as agent IP |
| `Injection.Spawn64` | string | Default 64-bit spawn-to process |
| `Injection.Spawn86` | string | Default 32-bit spawn-to process |

### Service

Enables the Service API WebSocket endpoint for external agents and ExternalC2.

| Field | Type | Description |
|---|---|---|
| `Endpoint` | string | URL path (e.g. `"service-ws"` -> `/service-ws`) |
| `Password` | string | Authentication password |

### Webhook

Posts agent check-in metadata to a Discord webhook.

```hcl
Webhook {
    Discord {
        Url = "https://discord.com/api/webhooks/ID/TOKEN"
    }
}
```
