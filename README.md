# Blockchain API

A Node.js Express API for interacting with Ethereum smart contracts and Chainlink price feeds.

## Features

- Web3.js integration for Ethereum blockchain interaction
- ERC-20 token information retrieval
- Real-time cryptocurrency prices via Chainlink oracles
- CORS-enabled REST API
- Network diagnostics and health checks

## Prerequisites

- Node.js (v14 or higher)
- An Ethereum RPC endpoint (e.g., Alchemy, Infura, or local node)

## Installation

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/flavioespinoza/blockchain-api.git
cd blockchain-api
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
WEB3_RPC_URL=your_rpc_endpoint_here
PORT=3000
```

### Getting an RPC Endpoint

You'll need an Ethereum RPC endpoint to connect to the blockchain:

**Option 1: Alchemy (Recommended)**
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Sign up for a free account
3. Create a new app for Ethereum Mainnet
4. Copy your API key
5. Your RPC URL will be: `https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY`

**Option 2: Infura**
1. Go to [infura.io](https://infura.io/)
2. Sign up for a free account
3. Create a new project
4. Copy your project ID
5. Your RPC URL will be: `https://mainnet.infura.io/v3/YOUR-PROJECT-ID`

## Usage

Start the server:
```bash
yarn start
```

For development with auto-restart:
```bash
yarn dev
```

The API will be available at `http://localhost:3000`

## Test URLs

Once the server is running, test these endpoints in your browser or with curl:

**Health Check:**
```
http://localhost:3000/
```

**Network Information:**
```
http://localhost:3000/network
```

**Token Information (USDC):**
```
http://localhost:3000/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```

**Token Information (WETH):**
```
http://localhost:3000/token/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
```

**Token Information (DAI):**
```
http://localhost:3000/token/0x6B175474E89094C44Da98b954EedeAC495271d0F
```

**ETH/USD Price:**
```
http://localhost:3000/price/eth
```

**BTC/USD Price:**
```
http://localhost:3000/price/btc
```

### Using curl:
```bash
# Health check
curl http://localhost:3000/

# Get network info
curl http://localhost:3000/network

# Get USDC token info
curl http://localhost:3000/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

# Get ETH price
curl http://localhost:3000/price/eth

# Get BTC price
curl http://localhost:3000/price/btc
```

## API Endpoints

### Health Check
```
GET /
```
Returns API information and available endpoints.

### Network Information
```
GET /network
```
Returns blockchain network details, chain ID, block number, and contract verification.

### Token Information
```
GET /token/:address
```
Retrieves ERC-20 token details (name, symbol, decimals, total supply).

**Example:**
```bash
curl http://localhost:3000/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```

### Cryptocurrency Prices

#### ETH/USD Price
```
GET /price/eth
```
Returns current ETH/USD price from Chainlink oracle.

#### BTC/USD Price
```
GET /price/btc
```
Returns current BTC/USD price from Chainlink oracle.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WEB3_RPC_URL` | Ethereum RPC endpoint URL | Yes |
| `PORT` | Server port (default: 3000) | No |

## Smart Contracts

The API interacts with the following contracts on Ethereum Mainnet:

- **USDC**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- **WETH**: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **DAI**: `0x6B175474E89094C44Da98b954EedeAC495271d0F`
- **Chainlink ETH/USD**: `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`
- **Chainlink BTC/USD**: `0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c`

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `500` - Server Error (blockchain/contract interaction failures)

## Development

To contribute or modify:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Technologies

- [Express.js](https://expressjs.com/) - Web framework
- [Web3.js](https://web3js.readthedocs.io/) - Ethereum JavaScript API
- [Chainlink](https://chain.link/) - Decentralized oracle network
- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management

## License

MIT

## Author

Flavio Espinoza

## Support

For issues and questions, please open an issue on GitHub.