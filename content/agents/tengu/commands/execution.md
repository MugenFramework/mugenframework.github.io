---
title: Execution
description: Command execution for the Tengu agent - shell, in-memory ELF, BOF, and screenshot.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## shell

```
shell <command>
```

Executes a command via `/bin/sh -c`. Captures and returns stdout and stderr.

```
shell id
shell cat /etc/passwd
shell "uname -a && hostname"
```

---

## memfd

```
memfd <local-elf> [args]
```

Sends a local ELF binary to the agent and executes it entirely in memory using `memfd_create` + `/proc/self/fd/<n>`. Nothing is written to disk on the target.

```
memfd /tools/linpeas.sh
memfd /tools/mimipenguin arg1 arg2
```

The process appears in `/proc` as `kworker/u:0`. Stdout and stderr are captured and returned.

---

## inline-execute

```
inline-execute <bof.x64.o> [args]
```

Loads and executes an ELF relocatable object (`.o`) in the implant process in-process. The Linux equivalent of Cobalt Strike / Havoc BOF execution - no fork, no new process.

### BeaconAPI

| Function | Description |
|---|---|
| `BeaconPrintf(type, fmt, ...)` | Print formatted output |
| `BeaconOutput(type, data, len)` | Output raw bytes |
| `BeaconDataParse(parser, data, len)` | Initialize a data parser |
| `BeaconDataExtract(parser, &len)` | Extract next string |
| `BeaconDataInt(parser)` | Extract next 4-byte int |
| `BeaconDataShort(parser)` | Extract next 2-byte short |
| `BeaconFormatAlloc(fmt, max)` | Allocate a format buffer |
| `BeaconFormatPrintf(fmt, ...)` | Append formatted string |
| `BeaconFormatFree(fmt)` | Free format buffer |
| `BeaconFormatToString(fmt, &len)` | Get format buffer as string |
| `BeaconIsAdmin()` | Returns 1 if running as root |

Unknown symbols fall through to `dlsym(RTLD_DEFAULT)` - libc and any loaded library are available without linking.

### Writing a BOF

```c
#include "beacon.h"

void go(char* args, int len) {
    datap parser;
    BeaconDataParse(&parser, args, len);
    char* target = BeaconDataExtract(&parser, NULL);
    BeaconPrintf(CALLBACK_OUTPUT, "Target: %s\n", target);
}
```

```bash
gcc -c -o mybof.x64.o mybof.c
```

---

## screenshot

```
screenshot
```

Captures a screenshot. Tries `scrot` (X11), then `grim` (Wayland), then `import` (ImageMagick) - uses whichever is available. Returns the image to the operator client.
