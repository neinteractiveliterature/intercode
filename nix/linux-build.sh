#!/bin/sh
# Runs nix for x86_64-linux inside a container, for machines without a Linux builder (e.g. a Mac).
# The Nix store persists in the "intercode-nix-store" Docker volume, so later runs are incremental.
# As with a flake, only tracked files are copied (use `git add -N` for new ones).
#
# Usage: nix/linux-build.sh image | docker load          builds the container image
#        nix/linux-build.sh [nix arguments...]           e.g. nix/linux-build.sh build 'path:.#frontend'
set -eu
cd "$(dirname "$0")/.."

git ls-files -z --cached |
  COPYFILE_DISABLE=1 tar --no-xattrs --null -T - -cf - |
  docker run --rm -i --platform linux/amd64 \
    -v intercode-nix-store:/nix \
    -e NIX_CONFIG="experimental-features = nix-command flakes
accept-flake-config = true
filter-syscalls = false
max-jobs = 4" \
    nixos/nix sh -c '
      set -e
      mkdir /src && tar -xf - -C /src && cd /src
      if [ "$1" = image ]; then
        # The build result is a script that writes the image to stdout
        stream="$(nix build --no-link --print-out-paths path:.#ociImage)"
        exec "$stream"
      fi
      exec nix "$@"' sh "$@"
