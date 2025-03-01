#!/bin/bash

# This script helps install @ironclad/rivet-core and @ironclad/rivet-node locally in another project

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RIVET_DIR="$(dirname "$SCRIPT_DIR")"

# Check if target project directory is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-your-project>"
  exit 1
fi

TARGET_PROJECT="$1"

# Check if target project exists
if [ ! -d "$TARGET_PROJECT" ]; then
  echo "Error: Target project directory does not exist: $TARGET_PROJECT"
  exit 1
fi

echo "Installing @ironclad/rivet-core and @ironclad/rivet-node in $TARGET_PROJECT"

# Create a temporary package.json for the target project
TEMP_PACKAGE_JSON=$(mktemp)
cat > "$TEMP_PACKAGE_JSON" << EOF
{
  "dependencies": {
    "@ironclad/rivet-core": "file:$RIVET_DIR/packages/core",
    "@ironclad/rivet-node": "file:$RIVET_DIR/packages/node"
  }
}
EOF

# Detect package manager
if [ -f "$TARGET_PROJECT/yarn.lock" ]; then
  PACKAGE_MANAGER="yarn"
elif [ -f "$TARGET_PROJECT/pnpm-lock.yaml" ]; then
  PACKAGE_MANAGER="pnpm"
else
  PACKAGE_MANAGER="npm"
fi

echo "Detected package manager: $PACKAGE_MANAGER"

# Install dependencies
cd "$TARGET_PROJECT"

if [ "$PACKAGE_MANAGER" = "yarn" ]; then
  yarn add "file:$RIVET_DIR/packages/core" "file:$RIVET_DIR/packages/node"
elif [ "$PACKAGE_MANAGER" = "pnpm" ]; then
  pnpm add "file:$RIVET_DIR/packages/core" "file:$RIVET_DIR/packages/node"
else
  npm install "file:$RIVET_DIR/packages/core" "file:$RIVET_DIR/packages/node"
fi

echo "Installation complete!"
echo "You can now import @ironclad/rivet-core and @ironclad/rivet-node in your project." 