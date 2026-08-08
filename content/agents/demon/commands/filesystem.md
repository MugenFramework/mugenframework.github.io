---
title: File System
description: File system commands for the Demon agent.
---

## dir

```
dir [path] [/s] [/b] [/d] [/f] [/starts <str>] [/contains <str>] [/ends <str>]
```

Lists a directory. Defaults to the current working directory. Returns name, type, size, last-modified date, and Windows attributes.

```
dir C:\Users /s /b /f /ends .ps1
```

---

## cd

```
cd <path>
```

Changes the current working directory of the implant.

---

## pwd

```
pwd
```

Prints the current working directory.

---

## cat

```
cat <file>
```

Reads and returns the content of a file.

---

## download

```
download <remote-path>
```

Downloads a file from the target to the operator client. Large files are transferred in chunks as a background job. Track progress with [`transfer list`](/docs/agents/demon/commands/jobs#transfer-list).

---

## upload

```
upload <local-path> <remote-path>
```

Uploads a file from the operator client to the target.

---

## mkdir

```
mkdir <path>
```

Creates a directory (and any missing parent directories).

---

## remove

```
remove <path>
```

Deletes a file or directory.

---

## cp

```
cp <source> <destination>
```

Copies a file.

---

## mv

```
mv <source> <destination>
```

Moves or renames a file.
