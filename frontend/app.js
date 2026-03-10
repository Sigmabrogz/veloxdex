/*
 * VELOX DEX - Application Logic
 * Neo-futuristic glassmorphism DEX on Base
 */

const CONFIG = {
  chainId: 8453,
  chainName: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  explorer: 'https://basescan.org',
  router: '0x47a76Cf3cE4ba9Ce8619e1b7aBa5d6817B5Ffc29',
  weth: '0x4200000000000000000000000000000000000006',
  usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};

const TOKENS = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    address: CONFIG.weth
  },
  USDC: {
    symbol: 'USDC', 
    name: 'USD Coin',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    address: CONFIG.usdc
  }
};

const ABI = {
  router: [
    'function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline) payable returns (uint[] amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) returns (uint[] amounts)'
  ],
  erc20: [
    'function balanceOf(address) view returns (uint)',
    'function approve(address spender, uint amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint)'
  ]
};

const ICONS = {
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

// EIP-6963 Wallet Discovery
const detectedWallets = new Map();

function setupEIP6963() {
  window.addEventListener('eip6963:announceProvider', (event) => {
    const { info, provider } = event.detail;
    detectedWallets.set(info.uuid, { info, provider });
  });
  window.dispatchEvent(new Event('eip6963:requestProvider'));
}

// Fallback wallet detection for wallets not supporting EIP-6963
function detectLegacyWallets() {
  const wallets = [];
  
  if (window.ethereum?.isMetaMask) {
    wallets.push({ name: 'MetaMask', provider: window.ethereum, icon: 'metamask' });
  }
  if (window.phantom?.ethereum) {
    wallets.push({ name: 'Phantom', provider: window.phantom.ethereum, icon: 'phantom' });
  }
  if (window.ethereum?.isCoinbaseWallet || window.coinbaseWalletExtension) {
    wallets.push({ name: 'Coinbase', provider: window.ethereum?.isCoinbaseWallet ? window.ethereum : window.coinbaseWalletExtension, icon: 'coinbase' });
  }
  if (window.ethereum?.isRabby) {
    wallets.push({ name: 'Rabby', provider: window.ethereum, icon: 'rabby' });
  }
  if (window.ethereum?.isTrust) {
    wallets.push({ name: 'Trust Wallet', provider: window.ethereum, icon: 'trust' });
  }
  if (window.okxwallet) {
    wallets.push({ name: 'OKX Wallet', provider: window.okxwallet, icon: 'okx' });
  }
  if (window.ethereum && wallets.length === 0) {
    wallets.push({ name: 'Browser Wallet', provider: window.ethereum, icon: 'default' });
  }
  
  return wallets;
}

setupEIP6963();

class VeloxDEX {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.router = null;
    this.usdc = null;
    this.fromToken = 'ETH';
    this.toToken = 'USDC';
    this.balances = { ETH: '0', USDC: '0' };
    this.currentProvider = null;
    this.currentPage = 'swap';
    this.init();
  }

  init() {
    this.render();
    this.bind();
  }

  render() {
    document.getElementById('app').innerHTML = this.getBetaBanner() + this.getHeader() + this.getPageContent() + this.getToast();
  }

  getBetaBanner() {
    return `
      <div class="beta-banner">
        <span class="beta-tag">BETA</span>
        <span>You're using an early version of Velox. New features coming soon!</span>
        <a href="https://github.com/Sigmabrogz/veloxdex" target="_blank" class="beta-link">Learn more →</a>
      </div>`;
  }

  getHeader() {
    return `
      <header class="header">
        <div class="header-inner">
          <a href="#" class="logo" data-page="swap">
            <div class="logo-mark">${ICONS.bolt}</div>
            <span class="logo-text">Velox</span>
            <span class="version-tag">BETA</span>
          </a>
          <nav class="nav">
            <a href="#" class="nav-item ${this.currentPage === 'swap' ? 'active' : ''}" data-page="swap">Swap</a>
            <a href="#" class="nav-item ${this.currentPage === 'pool' ? 'active' : ''}" data-page="pool">Pool</a>
            <a href="#" class="nav-item ${this.currentPage === 'portfolio' ? 'active' : ''}" data-page="portfolio">Portfolio</a>
          </nav>
          <div class="header-right">
            <div class="network-pill">
              <span class="network-dot"></span>
              <span>Base</span>
            </div>
            <button class="connect-btn" id="connectBtn">Connect</button>
          </div>
        </div>
      </header>`;
  }

  getToast() {
    return `
      <div class="toast" id="toast">
        <div class="toast-icon">${ICONS.check}</div>
        <span class="toast-msg" id="toastMsg">Success</span>
      </div>`;
  }

  getPageContent() {
    switch (this.currentPage) {
      case 'pool': return this.getPoolPage();
      case 'portfolio': return this.getPortfolioPage();
      default: return this.getSwapPage();
    }
  }

  getSwapPage() {
    return `
      <main class="main">
        <div class="swap-wrapper">
          <div class="swap-card">
            <div class="swap-header">
              <span class="swap-title">Swap</span>
              <button class="swap-settings">${ICONS.settings}</button>
            </div>
            <div class="token-module" id="fromModule">
              <div class="token-row-top">
                <span class="token-label">You pay</span>
                <span class="token-balance">
                  <span class="token-max" id="maxBtn">MAX</span>
                  <span id="fromBal">0.00</span>
                </span>
              </div>
              <div class="token-row-main">
                <button class="token-select" id="fromSelect">
                  <img src="${TOKENS.ETH.icon}" alt="ETH" class="token-icon">
                  <span class="token-symbol">ETH</span>
                  <span class="token-chevron">${ICONS.chevron}</span>
                </button>
                <input type="number" class="token-input" id="fromAmt" placeholder="0.0" step="any">
              </div>
              <div class="token-row-bottom">
                <span class="token-usd" id="fromUsd"></span>
              </div>
            </div>
            <div class="swap-divider">
              <button class="swap-arrow" id="swapDir">${ICONS.arrow}</button>
            </div>
            <div class="token-module" id="toModule">
              <div class="token-row-top">
                <span class="token-label">You receive</span>
                <span class="token-balance"><span id="toBal">0.00</span></span>
              </div>
              <div class="token-row-main">
                <button class="token-select" id="toSelect">
                  <img src="${TOKENS.USDC.icon}" alt="USDC" class="token-icon">
                  <span class="token-symbol">USDC</span>
                  <span class="token-chevron">${ICONS.chevron}</span>
                </button>
                <input type="number" class="token-input" id="toAmt" placeholder="0.0" readonly>
              </div>
              <div class="token-row-bottom">
                <span class="token-usd" id="toUsd"></span>
              </div>
            </div>
            <div class="swap-info" id="swapInfo" style="display:none">
              <div class="info-row">
                <span class="info-label">Rate</span>
                <span class="info-value" id="rateVal">-</span>
              </div>
              <div class="info-row">
                <span class="info-label">Slippage</span>
                <span class="info-value">0.5%</span>
              </div>
              <div class="info-row">
                <span class="info-label">Network fee</span>
                <span class="info-value" id="feeVal">~$0.01</span>
              </div>
            </div>
            <button class="swap-btn" id="swapBtn" disabled>Connect Wallet</button>
          </div>
          
          <!-- Coming Soon Features -->
          <div class="coming-soon-card">
            <div class="coming-soon-header">
              <span class="coming-soon-title">Coming Soon</span>
              <span class="coming-soon-tag">ROADMAP</span>
            </div>
            <div class="coming-soon-list">
              <div class="coming-soon-item">
                <span class="coming-soon-icon">📊</span>
                <div class="coming-soon-text">
                  <span class="coming-soon-name">Price Charts</span>
                  <span class="coming-soon-desc">Real-time token price visualization</span>
                </div>
              </div>
              <div class="coming-soon-item">
                <span class="coming-soon-icon">⏱️</span>
                <div class="coming-soon-text">
                  <span class="coming-soon-name">Limit Orders</span>
                  <span class="coming-soon-desc">Set your target price and auto-execute</span>
                </div>
              </div>
              <div class="coming-soon-item">
                <span class="coming-soon-icon">🔗</span>
                <div class="coming-soon-text">
                  <span class="coming-soon-name">Multi-Chain</span>
                  <span class="coming-soon-desc">Expand to Arbitrum, Optimism & more</span>
                </div>
              </div>
              <div class="coming-soon-item">
                <span class="coming-soon-icon">🎁</span>
                <div class="coming-soon-text">
                  <span class="coming-soon-name">Rewards Program</span>
                  <span class="coming-soon-desc">Earn rewards for trading & providing liquidity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>`;
  }

  getPoolPage() {
    return `
      <main class="main">
        <div class="page-wrapper">
          <div class="page-header">
            <h1 class="page-title">Liquidity Pools</h1>
            <p class="page-subtitle">Add liquidity to earn fees from trades</p>
          </div>
          
          <div class="pool-card">
            <div class="pool-pair">
              <div class="pool-icons">
                <img src="${TOKENS.ETH.icon}" alt="ETH" class="pool-icon">
                <img src="${TOKENS.USDC.icon}" alt="USDC" class="pool-icon pool-icon-overlap">
              </div>
              <div class="pool-info">
                <span class="pool-name">ETH / USDC</span>
                <span class="pool-fee">0.01% fee</span>
              </div>
            </div>
            <div class="pool-stats">
              <div class="pool-stat">
                <span class="pool-stat-label">TVL</span>
                <span class="pool-stat-value" id="poolTvl">$0.00</span>
              </div>
              <div class="pool-stat">
                <span class="pool-stat-label">Volume 24h</span>
                <span class="pool-stat-value" id="poolVolume">$0.00</span>
              </div>
              <div class="pool-stat">
                <span class="pool-stat-label">APR</span>
                <span class="pool-stat-value pool-apr">--</span>
              </div>
            </div>
            <button class="pool-btn" id="addLiquidityBtn">Add Liquidity</button>
          </div>

          <div class="pool-card" id="yourPosition" style="display:none">
            <div class="pool-section-title">Your Position</div>
            <div class="position-row">
              <span>Pool tokens</span>
              <span id="lpBalance">0.00</span>
            </div>
            <div class="position-row">
              <span>ETH deposited</span>
              <span id="ethDeposited">0.00</span>
            </div>
            <div class="position-row">
              <span>USDC deposited</span>
              <span id="usdcDeposited">0.00</span>
            </div>
            <button class="pool-btn pool-btn-secondary" id="removeLiquidityBtn">Remove Liquidity</button>
          </div>
        </div>
      </main>`;
  }

  getPortfolioPage() {
    return `
      <main class="main">
        <div class="page-wrapper">
          <div class="page-header">
            <h1 class="page-title">Portfolio</h1>
            <p class="page-subtitle">Track your assets and activity</p>
          </div>

          <div class="portfolio-summary">
            <div class="portfolio-total">
              <span class="portfolio-label">Total Balance</span>
              <span class="portfolio-value" id="totalBalance">$0.00</span>
            </div>
          </div>

          <div class="portfolio-card">
            <div class="portfolio-section-title">Assets</div>
            <div class="asset-row">
              <div class="asset-info">
                <img src="${TOKENS.ETH.icon}" alt="ETH" class="asset-icon">
                <div class="asset-details">
                  <span class="asset-name">Ethereum</span>
                  <span class="asset-symbol">ETH</span>
                </div>
              </div>
              <div class="asset-balance">
                <span class="asset-amount" id="portfolioEth">0.0000</span>
                <span class="asset-usd" id="portfolioEthUsd">$0.00</span>
              </div>
            </div>
            <div class="asset-row">
              <div class="asset-info">
                <img src="${TOKENS.USDC.icon}" alt="USDC" class="asset-icon">
                <div class="asset-details">
                  <span class="asset-name">USD Coin</span>
                  <span class="asset-symbol">USDC</span>
                </div>
              </div>
              <div class="asset-balance">
                <span class="asset-amount" id="portfolioUsdc">0.00</span>
                <span class="asset-usd" id="portfolioUsdcUsd">$0.00</span>
              </div>
            </div>
          </div>

          <div class="portfolio-card">
            <div class="portfolio-section-title">LP Positions</div>
            <div class="lp-row" id="lpPositionRow">
              <div class="lp-info">
                <div class="lp-icons">
                  <img src="${TOKENS.ETH.icon}" alt="ETH" class="lp-icon">
                  <img src="${TOKENS.USDC.icon}" alt="USDC" class="lp-icon lp-icon-overlap">
                </div>
                <span class="lp-name">ETH/USDC LP</span>
              </div>
              <div class="lp-balance">
                <span class="lp-amount" id="portfolioLp">0.00</span>
              </div>
            </div>
            <div class="empty-state" id="noLpState">
              <span>No liquidity positions yet</span>
              <a href="#" data-page="pool">Add liquidity</a>
            </div>
          </div>
        </div>
      </main>`;
  }

  bind() {
    // Navigation
    document.querySelectorAll('[data-page]').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        const page = el.dataset.page;
        if (page !== this.currentPage) {
          this.currentPage = page;
          this.render();
          this.bind();
          if (this.signer) this.updatePageData();
        }
      };
    });

    // Connect button
    document.getElementById('connectBtn').onclick = () => this.openWalletModal();
    
    // Page-specific bindings
    if (this.currentPage === 'swap') {
      document.getElementById('swapDir')?.addEventListener('click', () => this.flip());
      document.getElementById('fromAmt')?.addEventListener('input', () => this.quote());
      document.getElementById('maxBtn')?.addEventListener('click', () => this.setMax());
      document.getElementById('swapBtn')?.addEventListener('click', () => this.swap());
      document.querySelector('.swap-settings')?.addEventListener('click', () => this.openSettings());
    } else if (this.currentPage === 'pool') {
      document.getElementById('addLiquidityBtn')?.addEventListener('click', () => this.openAddLiquidityModal());
      document.getElementById('removeLiquidityBtn')?.addEventListener('click', () => this.openRemoveLiquidityModal());
    }
    
    // Update connected state
    if (this.signer) {
      this.signer.getAddress().then(addr => {
        const btn = document.getElementById('connectBtn');
        btn.textContent = addr.slice(0,6) + '...' + addr.slice(-4);
        btn.classList.add('connected');
        if (this.currentPage === 'swap') {
          document.getElementById('swapBtn').textContent = 'Enter amount';
        }
      });
      this.updatePageData();
    }
  }

  async updatePageData() {
    if (!this.signer) return;
    await this.fetchBalances();
    
    if (this.currentPage === 'portfolio') {
      const ethPrice = 2000; // Placeholder
      const ethBal = parseFloat(this.balances.ETH);
      const usdcBal = parseFloat(this.balances.USDC);
      
      document.getElementById('portfolioEth').textContent = ethBal.toFixed(4);
      document.getElementById('portfolioEthUsd').textContent = '$' + (ethBal * ethPrice).toFixed(2);
      document.getElementById('portfolioUsdc').textContent = usdcBal.toFixed(2);
      document.getElementById('portfolioUsdcUsd').textContent = '$' + usdcBal.toFixed(2);
      document.getElementById('totalBalance').textContent = '$' + ((ethBal * ethPrice) + usdcBal).toFixed(2);
    } else if (this.currentPage === 'pool') {
      await this.updatePoolData();
    }
  }

  async updatePoolData() {
    try {
      const pairAddress = '0x07597448E67374D5F4dcc63CA3703f44369bE112';
      const pairAbi = [
        'function getReserves() view returns (uint112, uint112, uint32)',
        'function balanceOf(address) view returns (uint256)',
        'function totalSupply() view returns (uint256)'
      ];
      const pair = new ethers.Contract(pairAddress, pairAbi, this.provider);
      const [r0, r1] = await pair.getReserves();
      const ethReserve = parseFloat(ethers.formatEther(r0));
      const usdcReserve = parseFloat(ethers.formatUnits(r1, 6));
      const tvl = (ethReserve * 2000) + usdcReserve;
      
      document.getElementById('poolTvl').textContent = '$' + tvl.toFixed(2);
      
      if (this.signer) {
        const addr = await this.signer.getAddress();
        const lpBal = await pair.balanceOf(addr);
        if (lpBal > 0) {
          document.getElementById('yourPosition').style.display = 'block';
          document.getElementById('lpBalance').textContent = parseFloat(ethers.formatEther(lpBal)).toFixed(6);
        }
      }
    } catch (e) {
      console.error('Pool data error:', e);
    }
  }

  openAddLiquidityModal() {
    if (!this.signer) return this.toast('Connect wallet first', 'error');
    
    const modal = document.createElement('div');
    modal.id = 'liquidityModal';
    modal.className = 'wallet-modal';
    modal.innerHTML = `
      <div class="wallet-content">
        <div class="wallet-header">
          <span>Add Liquidity</span>
          <button class="wallet-close">${ICONS.x}</button>
        </div>
        <div class="liquidity-body">
          <div class="liquidity-input">
            <label>ETH Amount</label>
            <input type="number" id="liqEthAmt" placeholder="0.0" step="any">
            <span class="liquidity-balance">Balance: ${parseFloat(this.balances.ETH).toFixed(4)}</span>
          </div>
          <div class="liquidity-input">
            <label>USDC Amount</label>
            <input type="number" id="liqUsdcAmt" placeholder="0.0" step="any">
            <span class="liquidity-balance">Balance: ${parseFloat(this.balances.USDC).toFixed(2)}</span>
          </div>
          <button class="swap-btn" id="confirmAddLiq">Add Liquidity</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.wallet-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.getElementById('confirmAddLiq').onclick = () => this.addLiquidity(modal);
  }

  async addLiquidity(modal) {
    const ethAmt = document.getElementById('liqEthAmt').value;
    const usdcAmt = document.getElementById('liqUsdcAmt').value;
    if (!ethAmt || !usdcAmt) return this.toast('Enter amounts', 'error');
    
    try {
      const btn = document.getElementById('confirmAddLiq');
      btn.disabled = true;
      btn.textContent = 'Approving...';
      
      const usdcContract = new ethers.Contract(CONFIG.usdc, ABI.erc20, this.signer);
      const usdcAmount = ethers.parseUnits(usdcAmt, 6);
      const approveTx = await usdcContract.approve(CONFIG.router, usdcAmount);
      await approveTx.wait();
      
      btn.textContent = 'Adding...';
      const routerAbi = ['function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) payable returns (uint, uint, uint)'];
      const router = new ethers.Contract(CONFIG.router, routerAbi, this.signer);
      const deadline = Math.floor(Date.now() / 1000) + 1200;
      const addr = await this.signer.getAddress();
      
      const tx = await router.addLiquidityETH(
        CONFIG.usdc, usdcAmount, 0, 0, addr, deadline,
        { value: ethers.parseEther(ethAmt) }
      );
      await tx.wait();
      
      modal.remove();
      this.toast('Liquidity added!', 'success');
      await this.fetchBalances();
      await this.updatePoolData();
    } catch (e) {
      console.error(e);
      this.toast(e.message || 'Failed', 'error');
    }
  }

  openRemoveLiquidityModal() {
    this.toast('Remove liquidity coming soon', 'error');
  }

  openWalletModal() {
    const existing = document.getElementById('walletModal');
    if (existing) {
      existing.remove();
      return;
    }
    
    // Get all available wallets
    const walletIcons = {
      metamask: `<svg class="wallet-icon" viewBox="0 0 40 40"><path fill="#E17726" d="M36.1 3.3L22.2 13.5l2.6-6.1z"/><path fill="#E27625" d="M3.9 3.3l13.7 10.3-2.4-6.2zm26.5 23.5l-3.7 5.6 7.9 2.2 2.3-7.6zm-28.4.2l2.2 7.6 7.9-2.2-3.7-5.6z"/><path fill="#E27625" d="M12 17.5l-2.2 3.3 7.8.4-.3-8.4zm16 0l-5.5-4.8-.2 8.5 7.8-.4zM12.1 32.4l4.7-2.3-4.1-3.2zm11.1-2.3l4.7 2.3-.6-5.5z"/><path fill="#D5BFB2" d="M27.9 32.4l-4.7-2.3.4 3.1v1.3zm-15.8 0l4.4 2.1v-1.3l.4-3.1z"/><path fill="#233447" d="M16.6 25l-3.9-1.2 2.8-1.3zm6.8 0l1.1-2.5 2.8 1.3z"/><path fill="#CC6228" d="M12.1 32.4l.6-5.6-4.3.1zm15.2-5.6l.6 5.6 3.7-5.5zm3.6-6l-7.8.4.7 4 1.1-2.5 2.8 1.3zm-18.2 2.9l2.8-1.3 1.1 2.5.7-4-7.8-.4z"/><path fill="#E27625" d="M8.1 20.8l3.3 6.4-.1-3.2zm20.5 3.2l-.1 3.2 3.3-6.4zm-12.7-2.8l-.7 4 .9 4.6.2-6.1zm8.2 0l-.4 2.5.2 6.1.9-4.6z"/><path fill="#F5841F" d="M24.1 25l-.9 4.6.6.5 4.1-3.2.1-3.2zm-11.4-1.3l.1 3.2 4.1 3.2.6-.5-.9-4.6z"/><path fill="#C0AC9D" d="M24.2 34.1v-1.3l-.4-.3h-5.6l-.4.3v1.3l-4.4-2.1 1.5 1.3 3.1 2.2h5.7l3.1-2.2 1.5-1.3z"/><path fill="#161616" d="M23.2 30.1l-.6-.5h-3.2l-.6.5-.4 3.1.4-.3h5.6l.4.3z"/><path fill="#763E1A" d="M36.8 14.1l1.2-5.8L36.1 3.3l-12.9 9.6 5 4.2 7 2 1.5-1.8-.7-.5 1.1-1-.8-.6 1.1-.8zM2 8.3l1.2 5.8-.8.6 1.1.8-.8.6 1.1 1-.7.5 1.5 1.8 7-2 5-4.2L3.9 3.3z"/><path fill="#F5841F" d="M35.2 19.1l-7-2 2.1 3.3-3.3 6.4 4.4-.1h6.5zm-23.2-2l-7 2-2.3 7.6h6.5l4.4.1-3.3-6.4zm10 3.3l.4-7.7 2-5.4h-8.8l2 5.4.4 7.7.2 2.5v6.1h3.2v-6.1z"/></svg>`,
      phantom: `<svg class="wallet-icon" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#AB9FF2"/><path fill="#fff" d="M29.5 20.5c0 5.2-4.3 9.5-9.5 9.5s-9.5-4.3-9.5-9.5c0-4.1 2.6-7.6 6.3-8.9.5-.2 1 .2 1 .7v2.2c0 .3-.2.6-.5.7-2.1.8-3.6 2.8-3.6 5.2 0 3.1 2.5 5.6 5.6 5.6s5.6-2.5 5.6-5.6c0-2.4-1.5-4.4-3.6-5.2-.3-.1-.5-.4-.5-.7v-2.2c0-.5.5-.9 1-.7 3.7 1.3 6.3 4.8 6.3 8.9z"/><circle cx="16" cy="18" r="2" fill="#fff"/><circle cx="24" cy="18" r="2" fill="#fff"/></svg>`,
      coinbase: `<svg class="wallet-icon" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#0052FF"/><path fill="#fff" d="M20 6a14 14 0 100 28 14 14 0 000-28zm0 22a8 8 0 110-16 8 8 0 010 16z"/><circle cx="20" cy="20" r="5" fill="#0052FF"/></svg>`,
      rabby: `<svg class="wallet-icon" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#8697FF"/><path fill="#fff" d="M20 8c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12S26.6 8 20 8zm0 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/><circle cx="20" cy="20" r="4" fill="#fff"/></svg>`,
      trust: `<svg class="wallet-icon" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#3375BB"/><path fill="#fff" d="M20 8c-1.7 0-3.3.3-4.8.9C13.7 9.5 12.5 10.3 11.5 11.3c-1 1-1.8 2.2-2.4 3.5-.6 1.3-.9 2.8-.9 4.3 0 3.3 1.5 6.4 4 8.5l7.8 6.4 7.8-6.4c2.5-2.1 4-5.2 4-8.5 0-1.5-.3-3-.9-4.3-.6-1.3-1.4-2.5-2.4-3.5-1-1-2.2-1.8-3.5-2.4C23.3 8.3 21.7 8 20 8zm0 20l-5-4.1c-1.6-1.3-2.5-3.3-2.5-5.4 0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5c0 2.1-.9 4.1-2.5 5.4L20 28z"/></svg>`,
      okx: `<svg class="wallet-icon" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#000"/><rect x="8" y="8" width="10" height="10" rx="2" fill="#fff"/><rect x="22" y="8" width="10" height="10" rx="2" fill="#fff"/><rect x="8" y="22" width="10" height="10" rx="2" fill="#fff"/><rect x="22" y="22" width="10" height="10" rx="2" fill="#fff"/></svg>`,
      default: `<div class="wallet-icon-placeholder">${ICONS.bolt}</div>`
    };
    
    // Build wallet list dynamically
    let walletsHtml = '';
    const legacyWallets = detectLegacyWallets();
    
    // Check EIP-6963 wallets first
    if (detectedWallets.size > 0) {
      detectedWallets.forEach(({ info, provider }) => {
        const icon = info.icon ? `<img class="wallet-icon" src="${info.icon}" alt="${info.name}">` : walletIcons.default;
        walletsHtml += `
          <button class="wallet-option" data-uuid="${info.uuid}">
            ${icon}
            <span>${info.name}</span>
            <span class="wallet-tag-secondary">Detected</span>
          </button>`;
      });
    }
    
    // Add common wallets with install links
    const commonWallets = [
      { id: 'metamask', name: 'MetaMask', detected: !!window.ethereum?.isMetaMask, popular: true },
      { id: 'phantom', name: 'Phantom', detected: !!window.phantom?.ethereum },
      { id: 'coinbase', name: 'Coinbase Wallet', detected: !!(window.ethereum?.isCoinbaseWallet || window.coinbaseWalletExtension) },
      { id: 'rabby', name: 'Rabby', detected: !!window.ethereum?.isRabby },
      { id: 'trust', name: 'Trust Wallet', detected: !!window.ethereum?.isTrust },
      { id: 'okx', name: 'OKX Wallet', detected: !!window.okxwallet },
    ];
    
    commonWallets.forEach(w => {
      const icon = walletIcons[w.id] || walletIcons.default;
      const tag = w.detected ? '<span class="wallet-tag-success">Installed</span>' : (w.popular ? '<span class="wallet-tag">Popular</span>' : '');
      walletsHtml += `
        <button class="wallet-option" data-wallet="${w.id}">
          ${icon}
          <span>${w.name}</span>
          ${tag}
        </button>`;
    });
    
    const modal = document.createElement('div');
    modal.id = 'walletModal';
    modal.className = 'wallet-modal';
    modal.innerHTML = `
      <div class="wallet-content">
        <div class="wallet-header">
          <span>Connect Wallet</span>
          <button class="wallet-close">${ICONS.x}</button>
        </div>
        <div class="wallet-body">${walletsHtml}</div>
        <div class="wallet-footer">
          <span>New to wallets?</span>
          <a href="https://ethereum.org/wallets" target="_blank">Learn more</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.wallet-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    // Handle EIP-6963 wallet clicks
    modal.querySelectorAll('[data-uuid]').forEach(btn => {
      btn.onclick = async () => {
        const uuid = btn.dataset.uuid;
        const wallet = detectedWallets.get(uuid);
        if (wallet) {
          modal.remove();
          await this.connectWithProvider(wallet.provider, wallet.info.name);
        }
      };
    });
    
    // Handle legacy wallet clicks
    modal.querySelectorAll('[data-wallet]').forEach(btn => {
      btn.onclick = async () => {
        const wallet = btn.dataset.wallet;
        modal.remove();
        await this.connectWallet(wallet);
      };
    });
  }

  async connectWithProvider(provider, name) {
    try {
      this.currentProvider = provider;
      this.provider = new ethers.BrowserProvider(provider);
      await this.provider.send('eth_requestAccounts', []);
      
      const net = await this.provider.getNetwork();
      if (Number(net.chainId) !== CONFIG.chainId) {
        await this.switchChain(provider);
        this.provider = new ethers.BrowserProvider(provider);
      }
      
      this.signer = await this.provider.getSigner();
      this.router = new ethers.Contract(CONFIG.router, ABI.router, this.signer);
      this.usdc = new ethers.Contract(CONFIG.usdc, ABI.erc20, this.signer);
      
      const addr = await this.signer.getAddress();
      const btn = document.getElementById('connectBtn');
      btn.textContent = addr.slice(0,6) + '...' + addr.slice(-4);
      btn.classList.add('connected');
      document.getElementById('swapBtn').textContent = 'Enter amount';
      
      await this.fetchBalances();
      this.toast(`Connected to ${name}`, 'success');
      
      provider.on?.('accountsChanged', () => location.reload());
      provider.on?.('chainChanged', () => location.reload());
    } catch (e) {
      console.error(e);
      this.toast(e.message || 'Connection failed', 'error');
    }
  }

  async switchChain(provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CONFIG.chainId.toString(16) }]
      });
    } catch (e) {
      if (e.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x' + CONFIG.chainId.toString(16),
            chainName: CONFIG.chainName,
            rpcUrls: [CONFIG.rpcUrl],
            blockExplorerUrls: [CONFIG.explorer],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
          }]
        });
      } else {
        throw e;
      }
    }
  }

  async connectWallet(walletType) {
    const installUrls = {
      metamask: 'https://metamask.io/download/',
      phantom: 'https://phantom.app/download',
      coinbase: 'https://www.coinbase.com/wallet',
      rabby: 'https://rabby.io/',
      trust: 'https://trustwallet.com/',
      okx: 'https://www.okx.com/web3'
    };
    
    let provider = null;
    let name = walletType;
    
    switch (walletType) {
      case 'metamask':
        provider = window.ethereum?.isMetaMask ? window.ethereum : null;
        name = 'MetaMask';
        break;
      case 'phantom':
        provider = window.phantom?.ethereum;
        name = 'Phantom';
        break;
      case 'coinbase':
        provider = window.ethereum?.isCoinbaseWallet ? window.ethereum : window.coinbaseWalletExtension;
        name = 'Coinbase Wallet';
        break;
      case 'rabby':
        provider = window.ethereum?.isRabby ? window.ethereum : null;
        name = 'Rabby';
        break;
      case 'trust':
        provider = window.ethereum?.isTrust ? window.ethereum : null;
        name = 'Trust Wallet';
        break;
      case 'okx':
        provider = window.okxwallet;
        name = 'OKX Wallet';
        break;
      default:
        provider = window.ethereum;
        name = 'Wallet';
    }
    
    if (!provider) {
      window.open(installUrls[walletType] || 'https://ethereum.org/wallets', '_blank');
      return this.toast(`Please install ${name}`, 'error');
    }
    
    await this.connectWithProvider(provider, name);
  }

  openSettings() {
    const existing = document.getElementById('settingsModal');
    if (existing) {
      existing.remove();
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'settingsModal';
    modal.className = 'settings-modal';
    modal.innerHTML = `
      <div class="settings-content">
        <div class="settings-header">
          <span>Settings</span>
          <button class="settings-close">${ICONS.x}</button>
        </div>
        <div class="settings-body">
          <div class="settings-row">
            <span class="settings-label">Slippage Tolerance</span>
            <div class="slippage-options">
              <button class="slippage-btn" data-val="0.1">0.1%</button>
              <button class="slippage-btn active" data-val="0.5">0.5%</button>
              <button class="slippage-btn" data-val="1.0">1.0%</button>
            </div>
          </div>
          <div class="settings-row">
            <span class="settings-label">Transaction Deadline</span>
            <div class="deadline-input">
              <input type="number" value="20" min="1" max="60"> minutes
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.settings-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    modal.querySelectorAll('.slippage-btn').forEach(btn => {
      btn.onclick = () => {
        modal.querySelectorAll('.slippage-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });
  }

  async fetchBalances() {
    if (!this.signer) return;
    const addr = await this.signer.getAddress();
    const eth = await this.provider.getBalance(addr);
    const usdc = await this.usdc.balanceOf(addr);
    this.balances.ETH = ethers.formatEther(eth);
    this.balances.USDC = ethers.formatUnits(usdc, 6);
    this.updateBalanceDisplay();
  }

  updateBalanceDisplay() {
    if (this.currentPage !== 'swap') return;
    const fromBalEl = document.getElementById('fromBal');
    const toBalEl = document.getElementById('toBal');
    if (!fromBalEl || !toBalEl) return;
    
    const fromBal = this.balances[this.fromToken];
    const toBal = this.balances[this.toToken];
    fromBalEl.textContent = parseFloat(fromBal).toFixed(this.fromToken === 'ETH' ? 4 : 2);
    toBalEl.textContent = parseFloat(toBal).toFixed(this.toToken === 'ETH' ? 4 : 2);
  }

  flip() {
    if (this.currentPage !== 'swap') return;
    [this.fromToken, this.toToken] = [this.toToken, this.fromToken];
    const from = TOKENS[this.fromToken];
    const to = TOKENS[this.toToken];
    const fromSelect = document.getElementById('fromSelect');
    const toSelect = document.getElementById('toSelect');
    if (!fromSelect || !toSelect) return;
    
    fromSelect.innerHTML = `
      <img src="${from.icon}" alt="${from.symbol}" class="token-icon">
      <span class="token-symbol">${from.symbol}</span>
      <span class="token-chevron">${ICONS.chevron}</span>
    `;
    toSelect.innerHTML = `
      <img src="${to.icon}" alt="${to.symbol}" class="token-icon">
      <span class="token-symbol">${to.symbol}</span>
      <span class="token-chevron">${ICONS.chevron}</span>
    `;
    document.getElementById('fromAmt').value = '';
    document.getElementById('toAmt').value = '';
    document.getElementById('swapInfo').style.display = 'none';
    this.updateBalanceDisplay();
  }

  setMax() {
    if (!this.signer || this.currentPage !== 'swap') return;
    const fromAmtEl = document.getElementById('fromAmt');
    if (!fromAmtEl) return;
    let max = parseFloat(this.balances[this.fromToken]);
    if (this.fromToken === 'ETH' && max > 0.001) max -= 0.001;
    fromAmtEl.value = max > 0 ? max.toFixed(this.fromToken === 'ETH' ? 6 : 2) : '0';
    this.quote();
  }

  async quote() {
    if (this.currentPage !== 'swap') return;
    const amtEl = document.getElementById('fromAmt');
    const btn = document.getElementById('swapBtn');
    const info = document.getElementById('swapInfo');
    const toAmt = document.getElementById('toAmt');
    if (!amtEl || !btn || !info || !toAmt) return;
    
    const amt = amtEl.value;
    if (!amt || parseFloat(amt) <= 0) {
      toAmt.value = '';
      info.style.display = 'none';
      btn.textContent = this.signer ? 'Enter amount' : 'Connect Wallet';
      btn.disabled = true;
      return;
    }
    if (!this.router) {
      toAmt.value = '';
      btn.textContent = 'DEX not deployed';
      btn.disabled = true;
      return;
    }
    try {
      const isEthIn = this.fromToken === 'ETH';
      const path = isEthIn ? [CONFIG.weth, CONFIG.usdc] : [CONFIG.usdc, CONFIG.weth];
      const amtIn = isEthIn ? ethers.parseEther(amt) : ethers.parseUnits(amt, 6);
      const amounts = await this.router.getAmountsOut(amtIn, path);
      const out = isEthIn
        ? parseFloat(ethers.formatUnits(amounts[1], 6)).toFixed(2)
        : parseFloat(ethers.formatEther(amounts[1])).toFixed(6);
      toAmt.value = out;
      const rate = (parseFloat(out) / parseFloat(amt)).toFixed(isEthIn ? 2 : 6);
      document.getElementById('rateVal').textContent = isEthIn ? `1 ETH = ${rate} USDC` : `1 USDC = ${rate} ETH`;
      info.style.display = 'block';
      btn.textContent = 'Swap';
      btn.disabled = false;
    } catch (e) {
      toAmt.value = '';
      btn.textContent = 'Insufficient liquidity';
      btn.disabled = true;
    }
  }

  async swap() {
    if (!this.signer || !this.router || this.currentPage !== 'swap') return;
    const amtEl = document.getElementById('fromAmt');
    const btn = document.getElementById('swapBtn');
    if (!amtEl || !btn) return;
    
    const amt = amtEl.value;
    if (!amt || parseFloat(amt) <= 0) return;
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    const addr = await this.signer.getAddress();
    try {
      btn.disabled = true;
      btn.textContent = 'Swapping...';
      if (this.fromToken === 'ETH') {
        const tx = await this.router.swapExactETHForTokens(0, [CONFIG.weth, CONFIG.usdc], addr, deadline, { value: ethers.parseEther(amt) });
        await tx.wait();
      } else {
        const amtIn = ethers.parseUnits(amt, 6);
        const allowance = await this.usdc.allowance(addr, CONFIG.router);
        if (allowance < amtIn) {
          btn.textContent = 'Approving...';
          const approveTx = await this.usdc.approve(CONFIG.router, ethers.MaxUint256);
          await approveTx.wait();
        }
        btn.textContent = 'Swapping...';
        const tx = await this.router.swapExactTokensForETH(amtIn, 0, [CONFIG.usdc, CONFIG.weth], addr, deadline);
        await tx.wait();
      }
      this.toast('Swap successful', 'success');
      document.getElementById('fromAmt').value = '';
      document.getElementById('toAmt').value = '';
      document.getElementById('swapInfo').style.display = 'none';
      await this.fetchBalances();
    } catch (e) {
      this.toast(e.message || 'Swap failed', 'error');
    } finally {
      btn.textContent = 'Enter amount';
      btn.disabled = true;
    }
  }

  toast(msg, type = 'success') {
    const t = document.getElementById('toast');
    const m = document.getElementById('toastMsg');
    const i = t.querySelector('.toast-icon');
    
    const icons = {
      success: ICONS.check,
      error: ICONS.x,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`
    };
    
    t.className = 'toast toast-' + type;
    m.textContent = msg;
    i.innerHTML = icons[type] || icons.info;
    t.classList.add('show');
    
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => t.classList.remove('show'), 4000);
  }
}

document.addEventListener('DOMContentLoaded', () => { window.velox = new VeloxDEX(); });
