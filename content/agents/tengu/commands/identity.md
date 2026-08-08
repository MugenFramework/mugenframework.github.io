---
title: Identity
description: Identity and session info commands for the Tengu agent.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## whoami

```
whoami
whoami /all
```

Without `/all`: prints the current effective username.

With `/all`: full identity dump including uid/euid, gid/egid, supplementary groups, Linux capabilities (`CapEff`), sudo rights, login session, TTY, shell, and home directory.

---

## id

```
id
```

Prints UID, GID, effective UIDs/GIDs, and supplementary groups. Same format as `/usr/bin/id`.

---

## env

```
env
```

Lists all environment variables of the implant process.

---

## pwd

```
pwd
```

Prints the current working directory of the implant.
