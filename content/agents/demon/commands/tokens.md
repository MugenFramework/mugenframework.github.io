---
title: Tokens
description: Token management and impersonation commands for the Demon agent.
---

The token vault stores stolen or crafted tokens for use across the session.

## token getuid

```
token getuid
```

Prints the user associated with the current token, including impersonation level.

---

## token list

```
token list
```

Lists all tokens stored in the vault with their ID, user, and type.

---

## token find

```
token find
```

Scans running processes for tokens that can be stolen. Useful for finding high-privilege tokens on the system.

---

## token steal

```
token steal <pid> [handle]
```

Opens the process token (or a specific handle), duplicates it, and adds it to the vault. Requires `SeDebugPrivilege` or to be running in the context of a process that can open the target.

---

## token impersonate

```
token impersonate <vault-id>
```

Impersonates a token from the vault. All subsequent operations run under that identity.

---

## token make

```
token make <domain> <user> <password> [LogonType]
```

Creates a new token via `LogonUser` using supplied credentials, and adds it to the vault.

Valid logon types: `LOGON_INTERACTIVE`, `LOGON_NETWORK`, `LOGON_BATCH`, `LOGON_SERVICE`, `LOGON_UNLOCK`, `LOGON_NETWORK_CLEARTEXT`, `LOGON_NEW_CREDENTIALS` (default)

```
token make domain.local Administrator Passw0rd@1234
```

---

## token privs-list

```
token privs-list
```

Lists all privileges in the current token with their enabled/disabled state.

---

## token privs-get

```
token privs-get
```

Enables all privileges present in the current token (calls `AdjustTokenPrivileges` for each).

---

## token revert

```
token revert
```

Reverts to the original process token (drops any impersonated token).

---

## token remove

```
token remove <vault-id>
```

Removes a specific token from the vault and closes its handle.

---

## token clear

```
token clear
```

Removes all tokens from the vault.
