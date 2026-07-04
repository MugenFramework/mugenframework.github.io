---
title: Command Registration
description: Registering custom commands for Demon and Tengu sessions.
---

## Registering a Demon command

```python
from havoc import Demon, RegisterCommand

def my_recon(agentID, *args):
    demon = Demon(agentID)
    taskID = demon.ConsoleWrite(demon.CONSOLE_TASK, "Running recon...")
    # Send built-in command
    demon.Command(taskID, 100, b'')
    return taskID

RegisterCommand(
    my_recon,           # function
    "",                 # module prefix (empty = top-level)
    "myrecon",          # command name
    "Custom recon",     # description
    0,                  # behavior (reserved)
    "",                 # usage
    "",                 # example
)
```

The command is now available in all Demon session consoles. Type `myrecon` to run it.

---

## Registering a module + command

Use a module prefix to group related commands:

```python
RegisterCommand(list_users, "", "list", "List domain users", 0, "[domain]", "", agent="sa")
```

Wait - the module is the second parameter, not the `agent` keyword:

```python
RegisterCommand(
    list_users,
    "sa",          # module prefix - user types "sa list"
    "list",
    "List domain users",
    0,
    "[domain]",
    "corp.local"
)
```

In the console: `sa list corp.local`

---

## Registering a Tengu command

Use `RegisterTenguCommand` (or `RegisterCommand` with `agent="Tengu"`). For Tengu sessions, always use `mugen.Tengu(agentID)` instead of `Demon(agentID)` - using `Demon` on a Tengu session crashes because `DemonCommands` is null for Linux agents.

```python
import mugen
from havoc import RegisterTenguCommand

def linux_users(agentID, *args):
    tengu  = mugen.Tengu(agentID)
    taskID = tengu.ConsoleWrite(tengu.CONSOLE_TASK, "Enumerating Linux users...")
    tengu.InlineExecute(taskID, "go", "bofs/users.x64.o", b'', False)
    return taskID

RegisterTenguCommand(
    linux_users,
    "",
    "users",
    "Enumerate local Linux users via /etc/passwd BOF",
    0,
    "",
    ""
)
```

In a Tengu session: `users`

---

## Command function signature

Your function always receives:

```python
def my_command(agentID: str, *args: str) -> str | None:
    ...
```

- `agentID` - the session identifier (pass to `Demon(agentID)`)
- `*args` - all tokens typed after the command name, as strings
- Return value - ignored (use `ConsoleWrite` to display output)

---

## Autocomplete

Registered commands are automatically added to the console autocomplete for sessions of the matching agent type. If a Tengu session is already open when you load the script, it will also receive the new entries immediately.

---

## Help integration

Type `help` in any session console to see all registered commands, including Python ones.

For Tengu sessions, Python commands are shown in a dedicated **Python Commands** section at the bottom of the help output.

---

## Module path

When a command is dispatched, the working directory is temporarily changed to the directory of the script that registered it. This means relative paths in `InlineExecute` (e.g. `"ObjectFiles/arp.x64.o"`) resolve correctly from the module's directory.
