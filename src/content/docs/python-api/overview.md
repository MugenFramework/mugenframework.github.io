---
title: Python API Overview
description: Extending Mugen with Python scripts and modules.
---

Mugen embeds a Python 3.10+ interpreter in the client. Scripts run in-process and have full access to the Mugen API.

## Importing

```python
# Mugen native
import mugen
from mugen import Demon, RegisterCommand, RegisterTenguCommand

# HavocFramework compatibility alias
import havoc
from havoc import Demon, RegisterCommand
```

Both `import mugen` and `import havoc` refer to the same C extension module. `Packer` is also available globally in all scripts without import.

The two session classes are `Demon` (Windows) and `mugen.Tengu` (Linux):

```python
demon = Demon(agentID)        # Demon session
tengu = mugen.Tengu(agentID)  # Tengu session
```

---

## Top-level functions

### `RegisterCommand(func, module, command, description, behavior, usage, example, agent="Demon")`

Register a custom command in the console autocomplete and dispatch table.

| Parameter | Type | Description |
|---|---|---|
| `func` | callable | Python function to call when the command is entered |
| `module` | str | Module prefix (e.g. `"sa"`) - use `""` for a top-level command |
| `command` | str | Command name |
| `description` | str | Short description shown in `help` |
| `behavior` | int | Reserved, pass `0` |
| `usage` | str | Usage string shown in `help` |
| `example` | str | Example shown in `help` |
| `agent` | str | `"Demon"` (default) or `"Tengu"` |

Your function is called with `(agentID, *args)` where `args` are the tokens typed after the command.

### `RegisterTenguCommand(func, module, command, description, behavior, usage, example)`

Identical to `RegisterCommand` but always targets Tengu (Linux) sessions. Equivalent to `RegisterCommand(..., agent="Tengu")`.

### `RegisterModule(name, description, behavior, usage, example, options)`

Register a module name (top-level group) for autocomplete grouping.

### `RegisterCallback(callback)`

Register a callback function called on every agent check-in packet.

### `GetDemons()`

Returns a list of active Demon session IDs.

### `GetListeners()`

Returns a list of active listener names.

### `AddCredential(agent_id, cred_type, username, secret, domain="", source="")`

Store a credential in the Loot Manager. See [Credentials API](/python-api/credentials/).

---

## The `Demon` class

```python
demon = Demon(agentID)
```

Represents an active **Demon** (Windows) session. Use this for Demon sessions only - passing a Tengu agent ID will crash because `DemonCommands` is null for Tengu agents.

### Methods

| Method | Description |
|---|---|
| `demon.ConsoleWrite(type, message)` | Write a message to the session console. Returns a task ID. |
| `demon.Command(taskID, commandID, args)` | Send a raw command packet |
| `demon.InlineExecute(taskID, func, path, args, threaded)` | Execute a BOF |
| `demon.DotnetInlineExecute(taskID, path, func, args)` | Execute a .NET assembly |
| `demon.DllSpawn(taskID, path, args)` | Spawn a DLL |
| `demon.DllInject(taskID, pid, path, args)` | Inject a DLL into a process |
| `demon.ShellcodeSpawn(taskID, path, args)` | Spawn shellcode |

### Console types

```python
demon.CONSOLE_TASK    # [*] task output - blue
demon.CONSOLE_INFO    # [+] info - green
demon.CONSOLE_ERROR   # [!] error - red
demon.CONSOLE_GOOD    # [+] success - bright green
```

### Attributes

```python
demon.ProcessArch   # "x64" or "x86"
demon.OSArch        # target OS arch
demon.User          # running user
demon.Computer      # hostname
demon.Domain        # Windows domain
demon.OSVersion     # OS version string
```

---

## The `Tengu` class

```python
tengu = mugen.Tengu(agentID)
```

Represents an active **Tengu** (Linux) session. Dispatches commands through `TenguCmds` - do not use `Demon(agentID)` for Tengu sessions, it will crash because `DemonCommands` is null for Linux agents.

### Methods

| Method | Description |
|---|---|
| `tengu.ConsoleWrite(type, message)` | Write a message to the session console. Returns a task ID. |
| `tengu.Command(taskID, commandID, args)` | Send a raw command packet |
| `tengu.InlineExecute(taskID, func, path, args, threaded)` | Execute an ELF BOF in-process |

### Console types

```python
tengu.CONSOLE_TASK    # [*] task output - blue
tengu.CONSOLE_INFO    # [+] info - green
tengu.CONSOLE_ERROR   # [!] error - red
```

### Attributes

```python
tengu.ProcessArch   # "x64"
tengu.User          # running user
tengu.Computer      # hostname
tengu.OSVersion     # OS version string
```
