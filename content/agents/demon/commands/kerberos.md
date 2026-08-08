---
title: Kerberos
description: Kerberos ticket operations for the Demon agent.
---

Kerberos commands interact directly with the Windows LSASS ticket store. They are standalone commands (no `kerberos` prefix).

## luid

```
luid
```

Returns the Locally Unique Identifier (LUID) of the current logon session.

---

## klist

```
klist [/luid 0x123 | /all]
```

Lists Kerberos tickets in the current or a specified logon session.

```
klist /all
```

---

## ptt

```
ptt <base64-ticket> [/luid <0x0>]
```

Passes a base64-encoded `.kirbi` ticket into the current or a specified logon session (Pass-the-Ticket).

---

## purge

```
purge [/luid <0x123>]
```

Purges Kerberos tickets from the current or a specified logon session.
