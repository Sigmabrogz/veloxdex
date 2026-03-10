# Contributing to Velox DEX

First off, thank you for considering contributing to Velox DEX! 🎉

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:
- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, wallet, network)

### 💡 Suggesting Features

Feature requests are welcome! Please include:
- **Clear description** of the feature
- **Use case** explaining why it's needed
- **Possible implementation** if you have ideas

### 🔧 Pull Requests

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our coding standards
5. **Test** your changes thoroughly
6. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add new swap animation"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** against `main`

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/veloxdex.git
cd veloxdex

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start frontend
cd frontend && python3 -m http.server 8080
```

## Coding Standards

### Solidity
- Use Solidity 0.8.20+
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Add NatSpec comments for public functions
- Ensure all tests pass before submitting

### JavaScript/Frontend
- Use ES6+ syntax
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, no code change
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

## Review Process

1. All PRs require at least one review
2. CI checks must pass
3. No merge conflicts with `main`
4. Code coverage should not decrease

## Questions?

Feel free to open an issue with the `question` label or reach out on Discord.

---

Thank you for helping make Velox better! ⚡
