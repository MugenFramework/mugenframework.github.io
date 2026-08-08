---
title: Network Recon
description: Active Directory and network enumeration commands for the Demon agent.
---

The `net` command group enumerates Active Directory and Windows network resources using standard Win32 APIs (`NetApi32`, `NetWkstaUserEnum`, etc.). No LDAP, no external tooling.

## net domain

```
net domain
```

Returns the DNS domain name of the current machine.

---

## net logons

```
net logons [\\server]
```

Lists currently logged-on users on the local or a remote machine.

---

## net sessions

```
net sessions [\\server]
```

Lists active sessions on the local or a remote machine (SMB sessions).

---

## net share

```
net share [\\server]
```

Lists shares on the local or a remote machine.

---

## net localgroup

```
net localgroup [\\server]
```

Lists local groups and their members.

---

## net group

```
net group [\\server]
```

Lists domain groups and their members.

---

## net users

```
net users [\\server]
```

Lists users and user information on the local or a remote machine.
