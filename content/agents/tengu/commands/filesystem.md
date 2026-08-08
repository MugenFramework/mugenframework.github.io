---
title: File System
description: File system commands for the Tengu agent.
---

Arguments in `<angle brackets>` are required; `[square brackets]` are optional.

---

## ls

```
ls [path]
```

Lists a directory. Defaults to the current working directory. Returns name, type, size, permissions, and last-modified date.

---

## cd

```
cd <path>
```

Changes the working directory of the implant process.

---

## pwd

```
pwd
```

Prints the current working directory.

---

## cat

```
cat <path>
```

Reads and returns the content of a file.

---

## download

```
download <path>
```

Downloads a file from the target to the operator client.

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

Creates a directory. Creates parent directories as needed (equivalent to `mkdir -p`).

---

## rm

```
rm <path>
rm -r <path>
```

Deletes a file. Pass `-r` to delete a directory recursively.

---

## cp

```
cp <src> <dst>
```

Copies a file.

---

## chmod

```
chmod <octal> <path>
```

Changes file permissions using octal notation.

```
chmod 755 /tmp/payload
chmod 644 /etc/cron.d/job
```
