---
title: Loot Manager
description: Collecting and managing captured credentials, screenshots and downloads.
---

The Loot Manager (**View → Loot**) centralises everything you capture during an operation into three tabs.

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

Screenshots captured via `screenshot` (Demon or Tengu) are listed here with their filename, size, and timestamp.

### Viewing a screenshot

Click any row to open the image in a resizable viewer dialog. Controls:

- `+` / `-` or mouse wheel to zoom in/out
- **Fit** button to fit the image to the window
- **Save** button to export a copy to disk

### Capturing a screenshot (Tengu)

```
screenshot
```

Tengu tries `scrot` (X11), `grim` (Wayland), and `import` (ImageMagick) in that order. The result is automatically saved on the teamserver and appears in the Screenshots tab.

---

## Downloads

Files downloaded from targets via `download` appear here with their original path, size, and timestamp.

Double-clicking a file with an image extension (`.png`, `.jpg`, `.bmp`, `.gif`, `.webp`) switches to the Screenshots tab and opens the image viewer directly.

Right-click any entry to delete it.
