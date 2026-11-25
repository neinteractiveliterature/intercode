{
  description = "Intercode";

  nixConfig = {
    extra-substituters = "https://nixpkgs-ruby.cachix.org";
    extra-trusted-public-keys = "nixpkgs-ruby.cachix.org-1:vrcdi50fTolOxWCZZkw0jakOnUI1T19oYJ+PRYdK4SM=";
  };

  inputs = {
    nixpkgs.url = "nixpkgs";
    ruby-nix.url = "github:inscapist/ruby-nix";
    # a fork that supports platform dependant gem
    bundix = {
      url = "github:inscapist/bundix/main";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    fu.url = "github:numtide/flake-utils";
    bob-ruby.url = "github:bobvanderlinden/nixpkgs-ruby";
    bob-ruby.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    {
      self,
      nixpkgs,
      fu,
      ruby-nix,
      bundix,
      bob-ruby,
    }:
    with fu.lib;
    eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ bob-ruby.overlays.default ];
        };
        rubyNix = ruby-nix.lib pkgs;

        # TODO generate gemset.nix with bundix
        projectGemset = if builtins.pathExists ./gemset.nix then import ./gemset.nix else { };

        # Bundler can't install its own locked version into the read-only Nix store, so provide it here.
        # Keep this in sync with BUNDLED WITH in Gemfile.lock. To get the new hash:
        #   nix-prefetch-url https://rubygems.org/gems/bundler-VERSION.gem
        gemset = projectGemset // {
          bundler = {
            version = "4.0.19";
            source = {
              type = "gem";
              remotes = [ "https://rubygems.org" ];
              sha256 = "0ivxb23gxd2a05lg2ciwynjali6ygr2baxbpqhy8bcvzqzj5d05l";
            };
          };
        };

        # If you want to override gem build config, see
        #   https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/ruby-modules/gem-config/default.nix
        gemConfig = { };

        # See available versions here: https://github.com/bobvanderlinden/nixpkgs-ruby/blob/master/ruby/versions.json
        ruby = pkgs."ruby-4.0.10";

        # Running bundix would regenerate `gemset.nix`
        # Built from default.nix because the fork's own flake output uses ruby_3_3, which nixpkgs
        # has removed. This Ruby only runs bundix itself, not the app.
        bundixcli = pkgs.callPackage "${bundix}/default.nix" {
          inherit pkgs;
          ruby = pkgs.ruby_4_0;
          bundler = pkgs.bundler.override { ruby = pkgs.ruby_4_0; };
        };

        # Use these instead of the original `bundle <mutate>` commands
        bundleLock = pkgs.writeShellScriptBin "bundle-lock" ''
          export BUNDLE_PATH=vendor/bundle
          bundle lock
        '';
        bundleUpdate = pkgs.writeShellScriptBin "bundle-update" ''
          export BUNDLE_PATH=vendor/bundle
          bundle lock --update
        '';
      in
      rec {
        # Experimental container image, alongside the Dockerfile (see nix/image.nix)
        packages = pkgs.lib.optionalAttrs pkgs.stdenv.hostPlatform.isLinux (
          import ./nix/image.nix {
            inherit pkgs;
            gems =
              (rubyNix {
                inherit gemset ruby;
                name = "intercode-production";
                gemConfig = pkgs.defaultGemConfig // gemConfig;
                groups = [ "default" ];
                extraRubySetup = "rm $out/bin/bundle $out/bin/bundler";
              }).env;
            revision = self.rev or self.dirtyRev or "unknown";
          }
        );

        inherit
          (rubyNix {
            inherit gemset ruby;
            name = "intercode";
            gemConfig = pkgs.defaultGemConfig // gemConfig;
            # ruby-nix's bundle wrappers run Bundler.setup before every command, which breaks things
            # like `bundle lock`. Without them, Ruby's own `bundle` switches to the version above.
            extraRubySetup = "rm $out/bin/bundle $out/bin/bundler";
          })
          env
          ;

        devShells = rec {
          default = dev;
          dev = pkgs.mkShell {
            buildInputs =
              [
                env
                bundixcli
                bundleLock
                bundleUpdate
              ]
              ++ (with pkgs; [
                yarn
                rufo
                # more packages here
              ]);
          };
        };
      }
    );
}
