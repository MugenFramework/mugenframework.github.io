---
title: Ops
description: Screenshots, credentials, downloads, resources, tasks and networking in one tab.
---

**View → Ops** is a single bottom tab. The navbar switches between Screenshots, Credentials, Downloads, Resources, Tasks and Networking.

Screenshots, Credentials and Downloads are the former Loot Manager pages.

## Credentials

Stores captured credentials with full metadata.

| Field | Description |
|---|---|
| Type | `plaintext`, `ntlm`, `hash`, `kerberos`, `ssh-key`, `api-key`, `other` |
| Username | Account name |
| Secret | Password, hash, or key material |
| Domain | Windows domain or hostname |
| Source | Where it was captured (e.g. `lsass`, `SAM`, `/.ssh/id_rsa`) |
| Agent | Session ID that captured it |
| Date | Timestamp |

### Adding credentials manually

Click **Add** in the Credentials tab and fill in the dialog.

### Adding credentials from a script

```python
from havoc import *

mugen.AddCredential(
    agent_id = demonID,
    cred_type = "ntlm",
    username  = "administrator",
    secret    = "aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c",
    domain    = "CORP",
    source    = "lsass"
)
```

See [Credentials API](/python-api/credentials/) for the full reference.

### Deleting credentials

Right-click an entry and select **Delete**.

All credentials are persisted in the local SQLite database and survive client restarts.

---

## Screenshots

Screenshots captured via `screenshot` (Demon or Tengu) are listed here with their filename and timestamp. Click a row to preview it in the pane on the right.

**Download** saves the file from the teamserver onto your machine (only you receive the bytes). **Delete** removes it from the teamserver and from every operator's Ops view. Both actions are also in the row context menu.

### Capturing a screenshot (Tengu)

```
screenshot
```

Tengu tries `scrot` (X11), `grim` (Wayland), and `import` (ImageMagick) in that order. The result is automatically saved on the teamserver and appears in the Screenshots tab.

---

## Downloads

Files downloaded from targets via `download` appear here with their original path, size, and timestamp.

Screenshots and downloads live on the teamserver (`data/loot/agents/`) and are restored when you reconnect after a server restart.

**Download** pulls the file onto your machine. **Delete** removes it from the teamserver (confirmation first). Same actions in the row context menu.

Clicking a file with an image extension (`.png`, `.jpg`, `.bmp`) switches to Screenshots and shows the preview if the bytes are already in the client.
