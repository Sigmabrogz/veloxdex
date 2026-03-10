# ⚡ Velox DEX

**Lightning Fast Swaps on Base**

> 🚧 **Beta Version** - This project is under active development. New features coming soon!

Velox is a decentralized exchange (DEX) built on Base, offering ultra-low fee token swaps with a sleek, modern interface. Built on proven Uniswap V2 architecture optimized for the Base L2 ecosystem.

![Velox DEX](https://img.shields.io/badge/Base-Mainnet-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Solidity](https://img.shields.io/badge/Solidity-0.8.20-purple) ![Status](https://img.shields.io/badge/status-beta-orange)

---

## 🌟 Features

- **Ultra-Low Fees**: Minimal swap fees for cost-effective trading
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

### Supported Tokens
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
├── adapter/             # DefiLlama integration
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
# Edit .env with your configuration
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
npm run frontend
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

## 🗺️ Roadmap

### Phase 1 (Current) - Beta Launch
- [x] Core swap functionality
- [x] Liquidity pools
- [x] Multi-wallet support
- [x] Modern UI/UX

### Phase 2 - Coming Soon
- [ ] Limit orders
- [ ] Price charts
- [ ] Token analytics
- [ ] Mobile optimization

### Phase 3 - Future
- [ ] Multi-chain support
- [ ] Governance token
- [ ] Yield farming
- [ ] Advanced trading features

---

## 🔐 Security

### Architecture
- Smart contracts based on battle-tested Uniswap V2 code
- Reentrancy protection via checks-effects-interactions
- Integer overflow protection (Solidity 0.8+)

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

- **Live App**: [0xveloxdex.xyz](https://0xveloxdex.xyz)
- **Contracts**: [BaseScan](https://basescan.org/address/0x47a76Cf3cE4ba9Ce8619e1b7aBa5d6817B5Ffc29)

---

## ⚠️ Disclaimer

This software is provided "as is", without warranty of any kind. This is a beta product under active development. Use at your own risk. Always verify contract addresses before interacting with any DeFi protocol.

---

Built with ⚡ by the Velox Team
