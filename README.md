# ⚡ Velox DEX

**Lightning Fast Swaps on Base**

Velox is a decentralized exchange (DEX) built on Base, offering ultra-low fee token swaps with a sleek, modern interface. Forked from Uniswap V2 with optimizations for the Base L2 ecosystem.

![Velox DEX](https://img.shields.io/badge/Base-Mainnet-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Solidity](https://img.shields.io/badge/Solidity-0.8.20-purple)

---

## 🌟 Features

- **Ultra-Low Fees**: 0.01% swap fee (vs 0.3% on Uniswap)
- **Lightning Fast**: Built on Base L2 for sub-second finality
- **Modern UI**: Neo-futuristic glassmorphism design
- **Multi-Wallet Support**: MetaMask, Coinbase Wallet, Phantom, Rabby, Trust, OKX
- **Liquidity Pools**: Add/remove liquidity and earn trading fees
- **Portfolio Tracking**: View your assets and LP positions

---

## 📜 Smart Contracts

Deployed on **Base Mainnet** (Chain ID: 8453)

| Contract | Address |
|----------|---------|
| Factory | [`0xa28dBAE4D926067F4c343aA8071e833b04C8b99E`](https://basescan.org/address/0xa28dBAE4D926067F4c343aA8071e833b04C8b99E) |
| Router | [`0x47a76Cf3cE4ba9Ce8619e1b7aBa5d6817B5Ffc29`](https://basescan.org/address/0x47a76Cf3cE4ba9Ce8619e1b7aBa5d6817B5Ffc29) |
| ETH/USDC Pair | [`0x07597448E67374D5F4dcc63CA3703f44369bE112`](https://basescan.org/address/0x07597448E67374D5F4dcc63CA3703f44369bE112) |

### Verified Tokens
- **WETH**: `0x4200000000000000000000000000000000000006`
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

---

## 🏗️ Architecture

```
veloxdex/
├── contracts/           # Solidity smart contracts
│   ├── UniswapV2Factory.sol
│   ├── UniswapV2Pair.sol
│   ├── UniswapV2Router02.sol
│   ├── interfaces/      # Contract interfaces
│   └── libraries/       # Helper libraries
├── frontend/            # Web application
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── scripts/             # Deployment scripts
├── adapter/             # DefiLlama adapter
└── deployments/         # Deployment addresses
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/Sigmabrogz/veloxdex.git
cd veloxdex

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your private key and RPC URL
```

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy-mainnet.js --network base
```

### Run Frontend Locally

```bash
cd frontend
python3 -m http.server 8080
# Open http://localhost:8080
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### Hardhat Config

The project uses Hardhat for smart contract development. See `hardhat.config.js` for network configurations.

---

## 📊 DefiLlama Integration

Velox includes a DefiLlama adapter for volume tracking:

```typescript
// adapter/index.ts
// Tracks daily swap volume across all pairs
```

To test the adapter:
```bash
cd /tmp
git clone https://github.com/DefiLlama/dimension-adapters
cd dimension-adapters
npm install
# Copy adapter/index.ts to dexs/velox/index.ts
npm test -- --adapter velox
```

---

## 🎨 Frontend Features

### Pages
- **Swap**: Exchange tokens with real-time quotes
- **Pool**: Add/remove liquidity to earn fees
- **Portfolio**: Track your assets and LP positions

### Wallet Support
- MetaMask
- Coinbase Wallet
- Phantom
- Rabby
- Trust Wallet
- OKX Wallet
- WalletConnect (QR code)

### Design System
- Neo-futuristic glassmorphism
- Cyan accent color (#00FFFF)
- Space Grotesk + JetBrains Mono typography
- Smooth animations and transitions

---

## 🔐 Security

### Audits
- Smart contracts are based on battle-tested Uniswap V2 code
- No external dependencies beyond OpenZeppelin standards

### Best Practices
- Reentrancy protection via checks-effects-interactions
- Integer overflow protection (Solidity 0.8+)
- Access control on admin functions

For security concerns, see [SECURITY.md](SECURITY.md).

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [Coming Soon]
- **Twitter**: [Coming Soon]
- **Discord**: [Coming Soon]
- **DefiLlama**: [Pending Listing]

---

## ⚠️ Disclaimer

This software is provided "as is", without warranty of any kind. Use at your own risk. Always verify contract addresses before interacting with any DeFi protocol.

---

Built with ⚡ by the Velox Team
