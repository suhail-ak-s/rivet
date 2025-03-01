# Local Installation of Rivet Packages

This directory contains a script to help you install `@ironclad/rivet-core` and `@ironclad/rivet-node` packages locally in another project.

## Option 1: Using the Installation Script

1. Make sure the script is executable:
   ```bash
   chmod +x install-local.sh
   ```

2. Run the script with the path to your target project:
   ```bash
   ./install-local.sh /path/to/your/project
   ```

   The script will:
   - Detect your package manager (npm, yarn, or pnpm)
   - Install both packages as file dependencies

## Option 2: Manual Installation

If you prefer to install the packages manually, you can add them to your project's dependencies:

### Using npm:
```bash
cd /path/to/your/project
npm install file:/Users/suhail/Documents/syia/rivet/packages/core file:/Users/suhail/Documents/syia/rivet/packages/node
```

### Using yarn:
```bash
cd /path/to/your/project
yarn add file:/Users/suhail/Documents/syia/rivet/packages/core file:/Users/suhail/Documents/syia/rivet/packages/node
```

### Using pnpm:
```bash
cd /path/to/your/project
pnpm add file:/Users/suhail/Documents/syia/rivet/packages/core file:/Users/suhail/Documents/syia/rivet/packages/node
```

## Troubleshooting

If you encounter any issues with the installation:

1. Make sure both packages are built:
   ```bash
   cd /Users/suhail/Documents/syia/rivet
   yarn build
   ```

2. Check that the file paths are correct and accessible from your project.

3. If using pnpm, you might need to add the following to your `.npmrc` file:
   ```
   node-linker=hoisted
   shamefully-hoist=true
   ```

4. If you still have issues, try installing one package at a time:
   ```bash
   # First install the core package
   pnpm add file:/Users/suhail/Documents/syia/rivet/packages/core
   
   # Then install the node package
   pnpm add file:/Users/suhail/Documents/syia/rivet/packages/node
   ``` 