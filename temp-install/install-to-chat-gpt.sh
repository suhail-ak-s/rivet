#!/bin/bash

# This script specifically installs @ironclad/rivet-core and @ironclad/rivet-node 
# in the chat-gpt project

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RIVET_DIR="$(dirname "$SCRIPT_DIR")"

# Assuming the chat-gpt project is at /Users/suhail/Documents/syia/chat-gpt
CHAT_GPT_DIR="/Users/suhail/Documents/syia/chat-gpt"

# Check if chat-gpt project exists
if [ ! -d "$CHAT_GPT_DIR" ]; then
  echo "Error: chat-gpt project directory does not exist: $CHAT_GPT_DIR"
  exit 1
fi

echo "Installing @ironclad/rivet-core and @ironclad/rivet-node in $CHAT_GPT_DIR"

# Copy the .npmrc file to the chat-gpt project
cp "$SCRIPT_DIR/.npmrc" "$CHAT_GPT_DIR/"

# Install dependencies
cd "$CHAT_GPT_DIR"

# First, try to install the core package
echo "Installing @ironclad/rivet-core..."
pnpm add "file:$RIVET_DIR/packages/core"

# Then, install the node package
echo "Installing @ironclad/rivet-node..."
pnpm add "file:$RIVET_DIR/packages/node"

echo "Installation complete!"
echo "You can now import @ironclad/rivet-core and @ironclad/rivet-node in your project." 