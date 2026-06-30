---
title: Writing Modules
description: How to write Python modules for Mugen compatible with HavocFramework/Modules.
---

## Minimal module structure

```python
from havoc import Demon, RegisterCommand

def my_command(agentID, *args):
    demon = Demon(agentID)
    taskID = demon.ConsoleWrite(demon.CONSOLE_TASK, "Tasked agent to do something")
    demon.InlineExecute(taskID, "go", f"ObjectFiles/mybof.{demon.ProcessArch}.o", b'', False)
    return taskID

RegisterCommand(my_command, "", "mycommand", "Does something useful", 0, "", "")
```

Save it anywhere, load it via **View → Scripts → Add Script**.

---

## Using Packer

`Packer` is available globally - no import needed.

```python
def recon_with_args(agentID, *args):
    demon  = Demon(agentID)
    packer = Packer()

    hostname = args[0] if args else ""
    packer.addWstr(hostname)      # wide string (UTF-16 LE)
    packed = packer.getbuffer()   # [total_size: 4B LE][fields...]

    taskID = demon.ConsoleWrite(demon.CONSOLE_TASK, "Running recon")
    demon.InlineExecute(taskID, "go", f"ObjectFiles/recon.{demon.ProcessArch}.o", packed, False)
    return taskID
```

### Packer methods

| Method | Type packed | Format |
|---|---|---|
| `addstr(s)` | UTF-8 string | `[len+1: 4B LE][bytes + \0]` |
| `addWstr(s)` | UTF-16 LE string | `[len+2: 4B LE][bytes + \0\0]` |
| `addbytes(b)` | Raw bytes | `[len: 4B LE][bytes]` |
| `addbool(b)` | Bool as uint32 | `[0 or 1: 4B LE]` |
| `adduint32(n)` | Unsigned 32-bit | `[n: 4B LE]` |
| `addint(n)` | Signed 32-bit | `[n: 4B LE]` |
| `addshort(n)` | Signed 16-bit | `[n: 2B LE]` |
| `getbuffer()` | - | `[total_size: 4B LE][all fields]` |

---

## HavocFramework/Modules compatibility

Existing modules from [HavocFramework/Modules](https://github.com/HavocFramework/Modules) load without modification:

```python
# This works as-is in Mugen
from havoc import Demon, RegisterCommand
```

- `import havoc` - aliased to `mugen` in `sys.modules` at startup
- `Packer` - injected into `builtins` at startup
- `sys.path` - the script's own directory is prepended at load time

---

## Tengu module example

```python
from havoc import Demon, RegisterTenguCommand

def enum_sudoers(agentID, *args):
    demon  = Demon(agentID)
    packer = Packer()
    taskID = demon.ConsoleWrite(demon.CONSOLE_TASK, "Enumerating sudoers")
    demon.InlineExecute(taskID, "go", "bofs/sudoers.x64.o", b'', False)
    return taskID

RegisterTenguCommand(enum_sudoers, "", "sudoers", "Enumerate sudo rules via /etc/sudoers BOF", 0, "", "")
```

---

## BOF path resolution

When a command is dispatched, the working directory is set to the script's directory. This means you can use relative paths:

```
ObjectFiles/arp.x64.o        # relative to the .py file
/opt/bofs/arp.x64.o          # absolute path also works
```

---

## Multi-command module

```python
from havoc import Demon, RegisterCommand

MODULE = "mymod"

def cmd_one(agentID, *args):
    ...

def cmd_two(agentID, *args):
    ...

RegisterCommand(cmd_one, MODULE, "one", "First command", 0, "", "")
RegisterCommand(cmd_two, MODULE, "two", "Second command", 0, "<target>", "10.0.0.1")
```

Usage in console: `mymod one`, `mymod two 10.0.0.1`
