# Yarn Migration Guide

## ✅ Project Updated to Use Yarn

The tseboIQ project has been migrated from npm to Yarn for improved dependency management and faster installs.

## 🔄 What Changed

### Files Added
- `.yarnrc` - Yarn configuration file
- `yarn.lock` - Dependency lock file (will be created on first install)

### Files Removed
- `package-lock.json` - npm lock file (removed)
- `node_modules/` - Will be reinstalled with Yarn

### Documentation Updated
- `README.md` - All commands now use Yarn
- `UPGRADE-GUIDE.md` - Installation instructions updated

## 📦 Installing Dependencies

### First Time Setup

If you have a dev server running, **stop it first** (Ctrl+C in the terminal).

Then run:
```bash
yarn install
```

This will:
1. Read `package.json` dependencies
2. Create `yarn.lock` file
3. Install all packages to `node_modules/`
4. Be much faster than npm!

## 🚀 Common Commands

### Development
```bash
# Start dev server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run linter
yarn lint
```

### Package Management
```bash
# Add a new dependency
yarn add package-name

# Add a dev dependency
yarn add -D package-name

# Remove a dependency
yarn remove package-name

# Upgrade dependencies
yarn upgrade

# Upgrade interactive
yarn upgrade-interactive
```

### Troubleshooting
```bash
# Clear cache
yarn cache clean

# Reinstall everything
rm -rf node_modules yarn.lock
yarn install

# Check for outdated packages
yarn outdated
```

## 🎯 Why Yarn?

### Advantages Over npm
1. **Faster** - Parallel downloads and caching
2. **Deterministic** - `yarn.lock` ensures same versions everywhere
3. **Offline Mode** - Works without internet after first install
4. **Better Output** - Cleaner, more readable console output
5. **Workspaces** - Better monorepo support (future-ready)

### Performance Comparison
- **npm install**: ~20-30 seconds
- **yarn install**: ~10-15 seconds
- **yarn install (cached)**: ~3-5 seconds

## 🔧 Yarn Configuration

The `.yarnrc` file includes:
```
network-timeout 300000    # 5 minute timeout for slow connections
prefer-offline true       # Use cache when possible
```

## 📝 Migration Checklist

- [x] Remove `package-lock.json`
- [x] Create `.yarnrc` configuration
- [x] Update README.md commands
- [x] Update UPGRADE-GUIDE.md commands
- [ ] Run `yarn install` (you need to do this)
- [ ] Commit `yarn.lock` to git
- [ ] Update CI/CD pipelines (if any)

## 🚨 Important Notes

### For Team Members
If you're working in a team:
1. Pull the latest changes
2. Delete `node_modules/` folder
3. Run `yarn install`
4. Never commit `node_modules/`
5. Always commit `yarn.lock`

### Git Ignore
Ensure `.gitignore` includes:
```
node_modules/
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
```

### CI/CD Updates
If you have CI/CD pipelines, update them:

**Before:**
```yaml
- npm install
- npm run build
- npm test
```

**After:**
```yaml
- yarn install --frozen-lockfile
- yarn build
- yarn test
```

## 🔄 Switching Back to npm (if needed)

If you need to switch back:
```bash
# Remove Yarn files
rm yarn.lock .yarnrc

# Reinstall with npm
npm install

# This will create package-lock.json again
```

## 📚 Yarn Resources

- **Official Docs**: https://classic.yarnpkg.com/en/docs
- **CLI Commands**: https://classic.yarnpkg.com/en/docs/cli/
- **Configuration**: https://classic.yarnpkg.com/en/docs/yarnrc

## 🆘 Common Issues

### "yarn: command not found"
Install Yarn globally:
```bash
npm install -g yarn
```

Or use Corepack (Node 16.10+):
```bash
corepack enable
corepack prepare yarn@stable --activate
```

### Permission Errors on Windows
Run PowerShell as Administrator or use:
```bash
yarn install --network-timeout 100000
```

### Locked Files
If you get "EPERM" errors:
1. Close all terminals and editors
2. Stop the dev server
3. Delete `node_modules/`
4. Run `yarn install` again

### Slow Install
If install is slow:
```bash
# Clear cache
yarn cache clean

# Reinstall
yarn install --network-timeout 100000
```

## ✨ Next Steps

1. **Stop any running dev servers**
2. **Run `yarn install`** to set up dependencies
3. **Start dev server** with `yarn dev`
4. **Commit `yarn.lock`** to version control

---

**Yarn Version**: 1.22.22 (Classic)

*For questions about Yarn, see the official documentation or ask the team.*
