require('dotenv').config();
const express = require('express');
const { Web3 } = require('web3');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Web3 with RPC endpoint
const web3 = new Web3(process.env.WEB3_RPC_URL);

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// ERC-20 Token Contracts for token information
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

// Chainlink Price Feed oracles for real-time prices
const CHAINLINK_PRICE_FEED_ABI = [
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "description",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint80",
        "name": "_roundId",
        "type": "uint80"
      }
    ],
    "name": "getRoundData",
    "outputs": [
      {
        "internalType": "uint80",
        "name": "roundId",
        "type": "uint80"
      },
      {
        "internalType": "int256",
        "name": "answer",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "startedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint80",
        "name": "answeredInRound",
        "type": "uint80"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestAnswer",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestRound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      {
        "internalType": "uint80",
        "name": "roundId",
        "type": "uint80"
      },
      {
        "internalType": "int256",
        "name": "answer",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "startedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint80",
        "name": "answeredInRound",
        "type": "uint80"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "version",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses
const CONTRACTS = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  CHAINLINK_ETH_USD: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  CHAINLINK_BTC_USD: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c'
};

// Start server
app.listen(port, () => {
  console.log(`Blockchain API running on port ${port}`);
  console.log(`API endpoints available at http://localhost:${port}`);
  console.log(`Web3 RPC: ${process.env.WEB3_RPC_URL || 'NOT SET'}`);
  
  web3.eth.getBlockNumber()
    .then(blockNumber => {
      console.log(`Web3 connected! Latest block: ${blockNumber}`);
    })
    .catch(error => {
      console.error('Web3 connection failed:', error.message);
    });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Blockchain API - Smart Contract Data API',
    version: '1.0.0',
    endpoints: [
      'GET /token/:address - Get ERC-20 token info',
      'GET /price/eth - Get ETH/USD price from Chainlink',
      'GET /price/btc - Get BTC/USD price from Chainlink',
      'GET /network - Get network information'
    ]
  });
});

// Test Web3 connection and network
app.get('/network', async (req, res) => {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    const chainId = await web3.eth.getChainId();
    const gasPrice = await web3.eth.getGasPrice();
    
    let networkName = 'Unknown';
    switch (Number(chainId)) {
      case 1:
        networkName = 'Ethereum Mainnet';
        break;
      case 11155111:
        networkName = 'Sepolia Testnet';
        break;
      case 5:
        networkName = 'Goerli Testnet';
        break;
      case 137:
        networkName = 'Polygon Mainnet';
        break;
      default:
        networkName = `Unknown (Chain ID: ${chainId})`;
    }
    
    const ethContractCode = await web3.eth.getCode(CONTRACTS.CHAINLINK_ETH_USD);
    const btcContractCode = await web3.eth.getCode(CONTRACTS.CHAINLINK_BTC_USD);
    const usdcContractCode = await web3.eth.getCode(CONTRACTS.USDC);
    
    res.json({
      network: {
        chainId: chainId.toString(),
        name: networkName,
        blockNumber: blockNumber.toString(),
        gasPrice: gasPrice.toString()
      },
      rpcUrl: process.env.WEB3_RPC_URL?.includes('alchemy') ? 'Alchemy' : 'Other',
      contracts: {
        usdc: {
          address: CONTRACTS.USDC,
          hasCode: usdcContractCode.length > 2,
          codeLength: usdcContractCode.length
        },
        ethUsd: {
          address: CONTRACTS.CHAINLINK_ETH_USD,
          hasCode: ethContractCode.length > 2,
          codeLength: ethContractCode.length
        },
        btcUsd: {
          address: CONTRACTS.CHAINLINK_BTC_USD,
          hasCode: btcContractCode.length > 2,
          codeLength: btcContractCode.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      rpcUrl: process.env.WEB3_RPC_URL ? 'Set but failing' : 'Not Set'
    });
  }
});

// Get ERC-20 token information
app.get('/token/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = new web3.eth.Contract(ERC20_ABI, address);
    
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
      contract.methods.totalSupply().call()
    ]);

    res.json({
      address,
      name,
      symbol,
      decimals: decimals.toString(),
      totalSupply: totalSupply.toString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch token information',
      details: error.message
    });
  }
});

// Get ETH/USD price from Chainlink
app.get('/price/eth', async (req, res) => {
  try {
    const contract = new web3.eth.Contract(
      CHAINLINK_PRICE_FEED_ABI,
      CONTRACTS.CHAINLINK_ETH_USD
    );

    try {
      const latestAnswer = await contract.methods.latestAnswer().call();
      const decimals = await contract.methods.decimals().call();
      const description = await contract.methods.description().call();
      
      const price = Number(latestAnswer) / Math.pow(10, Number(decimals));
      
      res.json({
        pair: 'ETH/USD',
        price: price.toFixed(2),
        rawPrice: latestAnswer.toString(),
        decimals: decimals.toString(),
        description,
        method: 'latestAnswer',
        contractAddress: CONTRACTS.CHAINLINK_ETH_USD
      });
      
    } catch (simpleError) {
      const [roundData, decimals, description] = await Promise.all([
        contract.methods.latestRoundData().call(),
        contract.methods.decimals().call(),
        contract.methods.description().call()
      ]);

      const price = Number(roundData.answer) / Math.pow(10, Number(decimals));
      const lastUpdated = new Date(Number(roundData.updatedAt) * 1000);

      res.json({
        pair: 'ETH/USD',
        price: price.toFixed(2),
        rawPrice: roundData.answer.toString(),
        decimals: decimals.toString(),
        description,
        roundId: roundData.roundId.toString(),
        lastUpdated: lastUpdated.toISOString(),
        method: 'latestRoundData',
        contractAddress: CONTRACTS.CHAINLINK_ETH_USD
      });
    }
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch ETH/USD price',
      details: error.message,
      contractAddress: CONTRACTS.CHAINLINK_ETH_USD
    });
  }
});

// Get BTC/USD price from Chainlink
app.get('/price/btc', async (req, res) => {
  try {
    const contract = new web3.eth.Contract(
      CHAINLINK_PRICE_FEED_ABI,
      CONTRACTS.CHAINLINK_BTC_USD
    );

    const [roundData, decimals, description] = await Promise.all([
      contract.methods.latestRoundData().call(),
      contract.methods.decimals().call(),
      contract.methods.description().call()
    ]);

    const price = Number(roundData.answer) / Math.pow(10, Number(decimals));
    const lastUpdated = new Date(Number(roundData.updatedAt) * 1000);

    res.json({
      pair: 'BTC/USD',
      price: price.toFixed(2),
      rawPrice: roundData.answer.toString(),
      decimals: decimals.toString(),
      description,
      roundId: roundData.roundId.toString(),
      lastUpdated: lastUpdated.toISOString(),
      contractAddress: CONTRACTS.CHAINLINK_BTC_USD
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch BTC/USD price',
      details: error.message,
      contractAddress: CONTRACTS.CHAINLINK_BTC_USD
    });
  }
});
