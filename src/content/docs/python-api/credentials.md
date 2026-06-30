---
title: Credentials API
description: Logging captured credentials into the Loot Manager from Python scripts.
---

## `AddCredential`

```python
mugen.AddCredential(
    agent_id,   # str  - session ID that captured the credential
    cred_type,  # str  - type (see below)
    username,   # str  - account name
    secret,     # str  - password, hash, or key material
    domain="",  # str  - Windows domain or hostname (optional)
    source=""   # str  - origin of the credential (optional)
)
```

### Credential types

| Value | Use for |
|---|---|
| `"plaintext"` | Clear-text passwords |
| `"ntlm"` | NTLM hash (`LM:NT` format) |
| `"hash"` | Other hash formats (SHA1, MD5, bcrypt…) |
| `"kerberos"` | Kerberos tickets (base64 ccache/kirbi) |
| `"ssh-key"` | SSH private key material |
| `"api-key"` | API tokens, AWS keys, etc. |
| `"other"` | Anything else |

---

## Examples

### NTLM from mimikatz output

```python
from havoc import Demon, RegisterCommand

def parse_and_store(agentID, output):
    # called from a CONSOLE_OUTPUT callback after sekurlsa::logonpasswords
    import re
    for m in re.finditer(r'Username : (\S+)\s+.*?NTLM\s+:\s+([0-9a-f]{32})', output, re.S):
        user, ntlm = m.group(1), m.group(2)
        mugen.AddCredential(
            agent_id  = agentID,
            cred_type = "ntlm",
            username  = user,
            secret    = f"aad3b435b51404eeaad3b435b51404ee:{ntlm}",
            source    = "lsass"
        )
```

### SSH key from a Linux session

```python
def grab_ssh_key(agentID, *args):
    demon = Demon(agentID)
    # ... read the key via cat / download ...
    mugen.AddCredential(
        agent_id  = agentID,
        cred_type = "ssh-key",
        username  = "alice",
        secret    = key_content,
        domain    = demon.Computer,
        source    = "~/.ssh/id_rsa"
    )
```

---

## Storage

Credentials are written to the local SQLite database immediately. They appear in the **Loot Manager → Credentials** tab and survive client restarts.
