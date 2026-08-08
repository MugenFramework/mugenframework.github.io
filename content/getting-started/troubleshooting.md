---
title: Troubleshooting
description: Common build errors and runtime issues.
---

## Build errors

### `fatal error: Python.h: No such file or directory`

Python development headers are missing. Install for your distro:

```bash
# Arch
sudo pacman -S python

# Ubuntu / Kali
sudo apt install python3.10-dev

# Debian
sudo apt install python3-dev python3.10-dev libpython3.10-dev
```

### Qt version mismatch (SIGABRT on client launch)

All Qt5 packages must be at the same version. This usually affects `qt5-websockets` on Arch when it lags behind `qt5-base`. Fix by building from source:

```bash
git clone https://invent.kde.org/qt/qt/qtwebsockets
cd qtwebsockets
git checkout kde/5.15
qmake && make -j$(nproc) && sudo make install
```

Then launch with:

```bash
QT_PLUGIN_PATH=/usr/lib/qt/plugins ./mugen client
```

---

## Runtime issues

### Font or formatting problems in the console

Some distros (Kali, older Ubuntu) fail to load the embedded Monaco font from Qt resources. Use any monospace font as a fallback - the console will still function correctly.

### Payload compiler not found

The teamserver expects specific compiler paths at startup. Check your profile `Build` block:

```hcl
Teamserver {
    Build {
        Compiler64 = "/usr/bin/x86_64-w64-mingw32-gcc"
        Compiler86 = "/usr/bin/i686-w64-mingw32-gcc"
        Nasm       = "/usr/bin/nasm"
    }
}
```

Install missing compilers:

```bash
# Arch
sudo pacman -S mingw-w64-gcc nasm

# Ubuntu / Debian / Kali
sudo apt install mingw-w64 nasm
```

---

## Behavior questions

### Why does Demon sleep obfuscation stop working while jobs are running?

Jobs run in their own threads. Demon sleep obfuscation requires all threads to be suspended to safely encrypt the heap and stack. Mugen waits for all active jobs to finish before applying obfuscation. Once jobs complete, normal obfuscated sleep resumes.

This does not affect Tengu - Tengu sleep obfuscation operates on code pages only and is not blocked by running jobs.
