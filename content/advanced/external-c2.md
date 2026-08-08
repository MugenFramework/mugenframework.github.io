---
title: External C2
description: Using a third-party transport layer between the teamserver and an agent.
---

External C2 lets a custom process act as the communication bridge between the Mugen teamserver and an agent. This enables non-HTTP transports: DNS, ICMP, Slack, Teams, Twitter, or any custom channel.

---

## Architecture

```
Agent <--custom channel--> ExternalC2 process <--WebSocket--> Teamserver
```

The ExternalC2 process connects to the teamserver via the Service API WebSocket, registers an External C2 listener, and relays raw agent packets in both directions.

---

## Requirements

Enable the Service API in your profile:

```hcl
Service {
    Endpoint = "service-ws"
    Password = "service-password"
}
```

---

## Using havoc-py

[havoc-py](https://github.com/HavocFramework/havoc-py) provides a Python SDK that handles the WebSocket protocol. It is compatible with the Mugen teamserver.

```bash
pip install -r requirements.txt
```

```python
from havoc.service import HavocService
from havoc_externalc2 import ExternalC2

service = HavocService(
    endpoint = "wss://teamserver:40056/service-ws",
    password = "service-password"
)

# register the ExternalC2 listener
c2 = ExternalC2(service, name="my-externalc2", endpoint="/externalc2")
c2.start()
```

The Mugen teamserver then relays agent traffic through this listener.

---

## Protocol

The ExternalC2 process communicates with the teamserver over JSON WebSocket messages. Key message types:

| Type | Direction | Description |
|---|---|---|
| `Register` | -> server | Authenticate with password |
| `ListenerExC2` | -> server | Register an ExternalC2 listener |
| `ListenerTransmit` | <- server | Forward agent packet to the C2 channel |
| `ListenerTransmit` | -> server | Forward agent response back to server |

Raw agent packets are base64-encoded in the `Request` field.

---

## Notes

- The ExternalC2 process runs outside Mugen - it is your responsibility to implement and deploy it.
- The Mugen client does not need to be open for ExternalC2 to function - only the teamserver needs to be running.
- Multiple ExternalC2 listeners can be active simultaneously.
