---
title: Custom Agent API
description: Building a custom agent that registers with the Mugen teamserver via the Service API.
---

The Service API lets you build and register a completely custom agent. The teamserver handles session management, tasking, and output display - you only implement the agent logic and transport.

---

## Overview

A custom agent integration has two parts:

1. **The agent** - runs on the target, implements your custom communication channel
2. **The handler** - a Python process connecting to the teamserver via WebSocket, acting as the bridge

The handler registers the agent type, receives operator tasks, and forwards agent responses.

---

## Requirements

Enable the Service API in the teamserver profile:

```hcl
Service {
    Endpoint = "service-ws"
    Password = "service-password"
}
```

---

## Handler skeleton (Python)

```python
from havoc.service import HavocService
from havoc.agent import HavocAgent, Command, CommandParam, Packer

class ShellCommand(Command):
    CommandId   = 0x01
    Name        = "shell"
    Description = "Execute a shell command"
    Help        = ""
    NeedAdmin   = False
    Params      = [
        CommandParam(name="cmd", is_file_path=False, is_optional=False)
    ]

    def job_generate(self, arguments: dict) -> bytes:
        packer = Packer()
        packer.add_data(arguments["cmd"])
        return packer.buffer

class MyAgent(HavocAgent):
    Name        = "MyAgent"
    MagicValue  = 0xDEADBEEF
    MaxSize     = 512 * 1024
    Arch        = "x64"
    Commands    = [ShellCommand()]

    def generate(self, config: dict) -> bytes:
        # return your compiled agent bytes here
        return b''

service = HavocService(
    endpoint = "wss://teamserver:40056/service-ws",
    password = "service-password"
)

agent = MyAgent(service)
agent.start()
```

---

## Agent registration flow

1. Handler connects and authenticates to the Service API WebSocket
2. Handler sends `RegisterAgent` with agent metadata (name, magic value, commands)
3. The teamserver and all connected clients show the new agent type in the payload builder
4. When a target checks in with the matching magic value, the handler receives `AgentRegister`
5. The handler forwards the registration to the teamserver via `BodyAgentRegister`
6. The session appears in the client

---

## Task flow

```
Operator types command
  -> client sends task to teamserver
  -> teamserver sends task to handler via WebSocket (BodyAgentTask)
  -> handler delivers task to agent via custom channel
  -> agent executes, returns output
  -> handler sends output to teamserver (BodyAgentOutput)
  -> output appears in the client console
```

---

## Magic value

Each agent type is identified by a 4-byte magic value embedded at the start of every check-in packet. Choose a unique value that does not conflict with existing agents:

| Agent | Magic value |
|---|---|
| Demon | randomized per server instance (default base: `0xDEADBEEF`) |
| Tengu | `0x54454E47` |

Demon's magic value is randomized at teamserver startup - check your running server's config for the actual value. Pick any value not in use for your custom agent.

---

## Reference implementation

See [Talon](https://github.com/HavocFramework/Talon) - a minimal custom agent example using this exact API. It is compatible with the Mugen teamserver.
