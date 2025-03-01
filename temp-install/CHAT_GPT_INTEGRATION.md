# Integrating Rivet Packages with Chat-GPT Project

This guide explains how to install and use the local Rivet packages (`@ironclad/rivet-core` and `@ironclad/rivet-node`) in the Chat-GPT project.

## Prerequisites

- Both repositories (rivet and chat-gpt) should be cloned to your local machine
- Node.js and pnpm should be installed
- The Rivet packages should be built (see the main README for build instructions)

## Directory Structure

Assuming the following directory structure:

```
/Users/suhail/Documents/syia/
├── rivet/                  # Rivet repository
│   ├── packages/
│   │   ├── core/           # @ironclad/rivet-core package
│   │   ├── node/           # @ironclad/rivet-node package
│   │   └── ...
│   └── ...
└── chat-gpt/               # Chat-GPT repository
    ├── src/
    ├── package.json
    └── ...
```

## Installation Options

### Option 1: Using the Automated Script (Recommended)

We've created a script specifically for installing the Rivet packages in the Chat-GPT project:

1. Navigate to the temp-install directory:
   ```bash
   cd /Users/suhail/Documents/syia/rivet/temp-install
   ```

2. Make sure the script is executable:
   ```bash
   chmod +x install-to-chat-gpt.sh
   ```

3. Run the script:
   ```bash
   ./install-to-chat-gpt.sh
   ```

   This script will:
   - Copy the necessary `.npmrc` configuration to the chat-gpt project
   - Install both packages as file dependencies
   - Handle the installation order to avoid dependency issues

### Option 2: Manual Installation

If you prefer to install the packages manually:

1. First, copy the `.npmrc` file to your chat-gpt project:
   ```bash
   cp /Users/suhail/Documents/syia/rivet/temp-install/.npmrc /Users/suhail/Documents/syia/chat-gpt/
   ```

2. Navigate to your chat-gpt project:
   ```bash
   cd /Users/suhail/Documents/syia/chat-gpt
   ```

3. Run a clean install to ensure the modules directory is using the correct configuration:
   ```bash
   pnpm install
   ```

4. Install the packages one at a time:
   ```bash
   pnpm add file:/Users/suhail/Documents/syia/rivet/packages/core
   pnpm add file:/Users/suhail/Documents/syia/rivet/packages/node
   ```

## Verification

To verify that the packages are installed correctly:

1. Check your package.json file:
   ```bash
   cat package.json | grep ironclad
   ```

   You should see:
   ```json
   "@ironclad/rivet-core": "file:/Users/suhail/Documents/syia/rivet/packages/core",
   "@ironclad/rivet-node": "file:/Users/suhail/Documents/syia/rivet/packages/node",
   ```

2. Check the node_modules directory:
   ```bash
   ls -la node_modules/@ironclad
   ```

   You should see both `rivet-core` and `rivet-node` directories.

## Using the Packages in Your Code

You can now import and use these packages in your code:

```javascript
import { /* components */ } from '@ironclad/rivet-core';
import { /* components */ } from '@ironclad/rivet-node';
```

## Working with Rivet Projects

The chat-gpt repository contains a Rivet project file (`mcp.rivet-project`). You can open and edit this file using the Rivet application.

## Troubleshooting

### Issue: Workspace Package Not Found

If you see an error like:
```
ERR_PNPM_WORKSPACE_PKG_NOT_FOUND  In : "@ironclad/rivet-core@workspace:^" is in the dependencies but no package named "@ironclad/rivet-core" is present in the workspace
```

This means the package is trying to use a workspace reference, which only works within the same monorepo. The solution is to use file references as described in this guide.

### Issue: Public Hoist Pattern Difference

If you see an error like:
```
ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF  This modules directory was created using a different public-hoist-pattern value. Run "pnpm install" to recreate the modules directory.
```

Run `pnpm install` to recreate the modules directory with the correct configuration before installing the local packages.

### Issue: Missing Dependencies

If you encounter dependency issues, make sure:
1. Both packages are built in the Rivet repository
2. You're installing the core package before the node package
3. Your `.npmrc` file has the correct configuration:
   ```
   node-linker=hoisted
   shamefully-hoist=true
   strict-peer-dependencies=false
   ```

## Updating the Packages

If you make changes to the Rivet packages, you'll need to:

1. Rebuild the packages in the Rivet repository:
   ```bash
   cd /Users/suhail/Documents/syia/rivet
   yarn build
   ```

2. Reinstall the packages in the chat-gpt project:
   ```bash
   cd /Users/suhail/Documents/syia/chat-gpt
   pnpm add file:/Users/suhail/Documents/syia/rivet/packages/core
   pnpm add file:/Users/suhail/Documents/syia/rivet/packages/node
   ```

## For Other Developers

If other developers want to use your branch with the local installation changes:

1. Clone your fork of the Rivet repository:
   ```bash
   git clone https://github.com/suhail-ak-s/rivet.git
   cd rivet
   ```

2. Checkout the local-package-installation branch:
   ```bash
   git checkout local-package-installation
   ```

3. Build the packages:
   ```bash
   yarn build
   ```

4. Follow the installation instructions in this guide, adjusting the file paths as needed for their system. 