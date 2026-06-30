---
title: Installation
description: How to build and install Mugen on your system.
---

## Requirements

| Dependency | Version |
|---|---|
| GCC | 10+ |
| CMake | 3.19+ |
| Qt5 | 5.15+ |
| Python | 3.10+ |
| Go | 1.21+ |
| libcurl | any recent |

### Debian / Ubuntu / Kali

```bash
sudo apt install -y build-essential cmake qt5-default qtbase5-dev \
  libqt5websockets5-dev python3-dev libssl-dev libcurl4-openssl-dev
```

### Arch Linux

```bash
sudo pacman -S base-devel cmake qt5-base qt5-websockets python openssl curl go
```

---

## Build

```bash
git clone https://github.com/MugenFramework/Mugen
cd Mugen
make
```

This builds both the teamserver (`./mugen-server`) and the Qt client (`./mugen-client`).

### Rebuild without wiping cache

```bash
make rebuild
```

---

## First Run

### 1. Start the teamserver

Create a profile file (e.g. `ops.yaotl`):

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
}

Demon {
    Sleep = 2
    Jitter = 15
}
```

Then start the server:

```bash
./mugen-server --profile ops.yaotl
```

### 2. Connect the client

```bash
./mugen-client
```

Fill in the connection dialog:
- **Host** - teamserver IP
- **Port** - as configured (default 40056)
- **User** - operator name
- **Password** - operator password

---

## Service API (optional)

To allow external Python agents or ExternalC2 connections, add a `Service` block to your profile:

```hcl
Service {
    Endpoint = "service-ws"
    Password = "service-password"
}
```

External processes connect to `ws://<host>:<port>/service-ws`.
