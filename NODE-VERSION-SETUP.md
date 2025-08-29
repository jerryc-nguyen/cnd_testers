# Node.js Version Management Setup

This project requires **Node.js v24.7.0** for consistent behavior across all environments.

## 🚀 Quick Setup

### Option 1: Using NVM (Recommended)

If you have [nvm](https://github.com/nvm-sh/nvm) installed:

```bash
# Navigate to project directory
cd /path/to/testers

# Install and use the specified Node.js version
nvm install
nvm use

# Verify version
node --version  # Should show v24.7.0
```

### Option 2: Using Nodenv

If you have [nodenv](https://github.com/nodenv/nodenv) installed:

```bash
# Navigate to project directory
cd /path/to/testers

# Install the specified Node.js version
nodenv install 24.7.0

# Verify version
node --version  # Should show v24.7.0
```

### Option 3: Using n

If you have [n](https://github.com/tj/n) installed:

```bash
# Navigate to project directory
cd /path/to/testers

# Install and use the specified Node.js version
n 24.7.0

# Verify version
node --version  # Should show v24.7.0
```

### Option 4: Using asdf

If you have [asdf](https://asdf-vm.com/) installed:

```bash
# Navigate to project directory
cd /path/to/testers

# Install the specified Node.js version
asdf install nodejs 24.7.0

# Verify version
node --version  # Should show v24.7.0
```

## 📁 Version Files Created

This project includes multiple version files for different Node.js managers:

- **`.nvmrc`** - For nvm users
- **`.node-version`** - For nodenv and n users  
- **`.tool-versions`** - For asdf users
- **`package.json` engines** - For npm version checking

## 🔧 Installation Instructions

### 1. Install Node.js Version Manager (if not installed)

#### Install NVM (macOS/Linux)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart terminal or run: source ~/.bashrc
```

#### Install NVM (Windows)
```bash
# Use nvm-windows: https://github.com/coreybutler/nvm-windows
```

#### Install Nodenv (macOS)
```bash
brew install nodenv
echo 'eval "$(nodenv init -)"' >> ~/.zshrc
# Restart terminal
```

### 2. Install Node.js v24.7.0

```bash
# Using nvm
nvm install 24.7.0
nvm use 24.7.0

# Using nodenv
nodenv install 24.7.0
nodenv local 24.7.0

# Using n
n 24.7.0

# Using asdf
asdf plugin add nodejs
asdf install nodejs 24.7.0
asdf local nodejs 24.7.0
```

### 3. Verify Installation

```bash
node --version   # Should show: v24.7.0
npm --version    # Should show: 10.x.x or higher
```

## 🎯 Auto-Switching Setup

### NVM Auto-Switch
Add this to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
# Auto-switch Node.js version when entering directory with .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### Nodenv Auto-Switch
Nodenv automatically switches based on `.node-version` file - no additional setup needed!

## 🚨 Troubleshooting

### Version Mismatch Error
If you see an error about Node.js version:

```bash
# Check current version
node --version

# If wrong version, switch using your preferred manager:
nvm use          # for nvm
nodenv local     # for nodenv (reads .node-version)
n 24.7.0         # for n
asdf local nodejs 24.7.0  # for asdf
```

### NPM Version Issues
```bash
# Update npm to latest compatible version
npm install -g npm@latest

# Or use specific version
npm install -g npm@10.8.0
```

### Permission Issues (macOS/Linux)
```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

## 📋 Project Setup Checklist

After setting up Node.js v24.7.0:

```bash
# 1. Verify Node.js version
node --version  # Should be v24.7.0

# 2. Install project dependencies
npm install

# 3. Install Playwright browsers
npm run install:browsers

# 4. Run tests to verify setup
npm run test:local:login
```

## 🎯 Why Node.js v24.7.0?

- **Latest LTS Features**: Access to newest stable features
- **Performance**: Improved V8 engine performance
- **Security**: Latest security patches
- **Playwright Compatibility**: Optimal compatibility with Playwright
- **Team Consistency**: Everyone uses the same version

## 🔄 Updating Node.js Version

To update the project to a new Node.js version:

1. Update `.nvmrc`
2. Update `.node-version` 
3. Update `.tool-versions`
4. Update `package.json` engines field
5. Test all functionality
6. Update this documentation

## 📞 Need Help?

If you encounter issues:

1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`
3. Try clearing npm cache: `npm cache clean --force`
4. Reinstall dependencies: `rm -rf node_modules && npm install`
5. Check project documentation or ask the team

Happy testing! 🚀
