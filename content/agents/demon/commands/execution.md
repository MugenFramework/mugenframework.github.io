---
title: Execution
description: Execution commands for the Demon agent - shell, BOF, .NET, shellcode injection.
---

## shell

```
shell <command>
```

Executes a command via `cmd.exe /c`. Output is captured and returned.

---

## powershell

```
powershell <command>
```

Executes a command via `powershell.exe -c`. Output is captured and returned.

---

## inline-execute (BOF)

```
inline-execute <bof.x64.o> [args]
```

Executes a [Beacon Object File](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/beacon-object-files_main.htm) in the implant process. The BOF is loaded, relocated, and run in-process using the CoffeeLdr engine.

**Execution mode** (controlled by [`config implant.coffee.threaded`](/docs/agents/demon/commands/config)):
- **Threaded (default)** - BOF runs in a new thread registered as a background job. Non-blocking.
- **Non-threaded** - BOF runs synchronously in the beacon thread.

**VEH mode** (controlled by [`config implant.coffee.veh`](/docs/agents/demon/commands/config)): installs a vectored exception handler so BOFs that trigger exceptions are caught and reported instead of crashing the implant.

---

## dotnet inline-execute

```
dotnet inline-execute <assembly.exe> [args]
```

Loads and executes a .NET assembly in-process using the CLR hosting API. Only one CLR instance is active at a time; subsequent calls reuse the running CLR.

```
dotnet inline-execute /tmp/Seatbelt.exe -group=all -full
```

---

## dotnet list-versions

```
dotnet list-versions
```

Lists the installed .NET Framework versions on the target.

---

## shellcode inject

```
shellcode inject <arch> <pid> <path>
shellcode spawn <arch> <path>
shellcode execute <arch> <path>
```

Shellcode injection techniques.

| Subcommand | Behaviour |
|---|---|
| `inject` | Inject shellcode into an existing process by PID |
| `spawn` | Spawn the configured sacrifice process and inject (fork-and-run) |
| `execute` | Execute shellcode in the current process (self-inject) |

The memory allocation and execution technique are set with [`config memory.alloc`](/docs/agents/demon/commands/config) and [`config memory.execute`](/docs/agents/demon/commands/config).

---

## dll inject / dll spawn

```
dll inject <pid> <dll-path> [args]
dll spawn <dll-path> [args]
```

DLL injection techniques.

| Subcommand | Behaviour |
|---|---|
| `inject` | Inject a DLL into a remote process by PID |
| `spawn` | Spawn the configured sacrifice process and inject a reflective DLL (fork-and-run) |
