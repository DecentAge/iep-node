# IEP Node

The [Infinity Economics](https://infinity-economics.io) node with the web wallet. Source: [github.com/DecentAge/iep-node](https://github.com/DecentAge/iep-node) (GPLv2).

## Quick start

```bash
docker run -d --name iep-node --restart unless-stopped \
  -e ADMIN_PASSWORD=<your-admin-password> \
  -p 23456:23456 -p 127.0.0.1:23457:23457 \
  -v iep-node-db:/iep-node/db \
  decentage/iep-node:latest
```

The node joins the mainnet and downloads the blockchain (`docker logs -f iep-node`). The wallet is at <http://localhost:23457/wallet/>.

| Variable | Default | |
|---|---|---|
| `ADMIN_PASSWORD` | required | admin API password, at least 5 characters |
| `NETWORK_ENVIRONMENT` | `mainnet` | `mainnet` or `testnet` (testnet ports: 8776 peer, 9876 API) |
| `MY_ADDRESS` | empty | public IP or host name, so other nodes can connect back |

Open the peer port (23456) in your firewall; keep the API port (23457) on localhost. Data lives in `/iep-node/db` — keep that volume across updates.

## Tags

`X.Y.Z` (a release), `X.Y` (newest patch of a minor version), `latest` (newest release).

## Documentation

Compose example, update, backup and security notes: [Run a Node with Docker](https://wiki.infinity-economics.io/latest/how-to-guide/docker/).
