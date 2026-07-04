---
title: Script Manager
description: Loading and managing Python scripts and modules.
---

The Script Manager (**View → Scripts**) lets you load Python scripts that extend Mugen with custom commands and automation.

## Auto-loader

All `.py` files in `~/.mugen/modules/` are loaded automatically at startup - no manual steps needed. Drop a script there and it is available on the next client start.

## Loading a script manually

1. Open **View → Scripts**
2. Click **Add Script**
3. Select a `.py` file - any path on disk is supported
4. The script is executed immediately and its registered commands become available in all matching sessions

Scripts are persisted: they reload automatically on the next client start.

## HavocFramework/Modules compatibility

Mugen is fully compatible with [HavocFramework/Modules](https://github.com/HavocFramework/Modules). Load any module directly without modification:

```
~/github/Modules/SituationalAwareness/SituationalAwareness.py
```

`import havoc` works from any directory - it is aliased to `mugen` at startup. `Packer` is also available globally without import.

## Using registered commands

Once a script is loaded, its registered commands appear in the session console autocomplete. Type `help` to list them.

**Example - SituationalAwareness loaded:**

```
[Demon] > arp
[Demon] > whoami
[Demon] > ldapsearch "(samAccountType=805306368)" cn
[Demon] > sc_enum
```

## Removing a script

Right-click the script in the list and select **Remove**. Registered commands from that script are unregistered immediately.

## Writing your own scripts

See [Writing Modules](/python-api/modules/) for the full guide.
