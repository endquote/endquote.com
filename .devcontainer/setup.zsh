#!/bin/zsh

# install asdf
git -c advice.detachedHead=false clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.1
sed -i 's/^plugins=(\(.*\))/plugins=(\1 asdf)/' ~/.zshrc
source ~/.zshrc

# install asdf plugins
asdf plugin add nodejs
asdf plugin add pnpm

# install tools specified in .tool-versions 
asdf install

# install npm dependencies
pnpm clean
pnpm install

