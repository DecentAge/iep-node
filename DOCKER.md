# IEP Node

The [Infinity Economics](https://infinity-economics.io) (IEP) node with the web wallet. Run your own XIN node on mainnet or testnet.

Source: [github.com/DecentAge/iep-node](https://github.com/DecentAge/iep-node) (GPLv2) · Platform: `linux/amd64`

## Quick start

```bash
docker run -d --name iep-node --restart unless-stopped \
  -e ADMIN_PASSWORD=<at-least-5-characters> \
  -p 23456:23456 -p 127.0.0.1:23457:23457 \
  -v iep-node-db:/iep-node/db \
  decentage/iep-node:latest
```

The node joins the mainnet and downloads the blockchain; follow it with `docker logs -f iep-node`. The wallet is at <http://localhost:23457/wallet/>.

**Testnet:** add `-e NETWORK_ENVIRONMENT=testnet` and use the testnet ports: `-p 8776:8776 -p 127.0.0.1:9876:9876` (wallet at <http://localhost:9876/wallet/>).

**Docker Compose:** see [`docker/docker-compose.yml`](https://github.com/DecentAge/iep-node/blob/master/docker/docker-compose.yml).

## Configuration

| Variable | Default | Description |
|---|---|---|
| `ADMIN_PASSWORD` | – (required) | Password for the node's admin API, at least 5 characters. The node does not start without it. |
| `NETWORK_ENVIRONMENT` | `mainnet` | `mainnet` or `testnet`. Peers and ports are set for the chosen network. |
| `MY_ADDRESS` | empty | Public IP address or host name of your server, so other nodes can connect back. |
| `MY_HALLMARK` | empty | Optional hallmark of your node, bound to `MY_ADDRESS`. |
| `DEBUG` | `false` | `true` for verbose logging. |

## Ports and security

| Network | Peer port (open it) | API and wallet (keep local) |
|---|---|---|
| Mainnet | 23456 | 23457 |
| Testnet | 8776 | 9876 |

- Open the peer port in your firewall so other nodes can reach yours.
- Keep the API port bound to `127.0.0.1` as above. To offer the API publicly, put it behind a reverse proxy with HTTPS.
- Use a strong, random `ADMIN_PASSWORD`. Never pass the passphrase of an account with funds on the command line or in a compose file.

## Data and updates

All node data (blockchain database and search index) is in the volume at `/iep-node/db`. Keep it when you update:

```bash
docker pull decentage/iep-node:latest
docker rm -f iep-node
# then run the same docker run command as above
```

The first start of a new version may migrate the database, which can take a few minutes. A database from a node release before 0.4.1 cannot be used directly: start release 0.4.2 once first (see the wiki).

## Tags

| Tag | Meaning |
|---|---|
| `X.Y.Z` (e.g. `0.4.3`) | a specific release — pin this in production |
| `X.Y` (e.g. `0.4`) | the newest patch release of that minor version |
| `latest` | the newest release |

Only released versions are published here. Every image is scanned for vulnerabilities before it is pushed.

## Documentation

[Run a Node with Docker](https://wiki.infinity-economics.io/latest/how-to-guide/docker/) — Compose, backup, upgrade from old releases and more.
