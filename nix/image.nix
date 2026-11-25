# Experimental: builds the equivalent of the Dockerfile's `production` stage, for comparing the two.
{
  pkgs,
  # ruby-nix environment containing only the production gems
  gems,
  revision,
}:
let
  inherit (pkgs) lib;
  nodejs = pkgs.nodejs_26;

  # Changing these files shouldn't rebuild the app
  src = lib.fileset.toSource {
    root = ../.;
    fileset = lib.fileset.difference ../. (
      lib.fileset.unions [
        ../nix
        ../flake.nix
        ../flake.lock
        ../gemset.nix
        ../Dockerfile
        # Also excluded by .dockerignore
        ../.dockerignore
        ../.env.development
        ../.github/workflows
        ../docker-compose.yml
        ../docker-compose.test.yml
        ../docker-compose.load_production_database.yml
      ]
    );
  };

  # The `frontend` stage
  frontend = pkgs.stdenv.mkDerivation (finalAttrs: {
    name = "intercode-frontend";
    inherit src;

    # After a yarn.lock change, regenerate both of these:
    #   yarn-berry-fetcher missing-hashes yarn.lock > nix/yarn-missing-hashes.json
    #   yarn-berry-fetcher prefetch yarn.lock nix/yarn-missing-hashes.json
    missingHashes = ./yarn-missing-hashes.json;
    offlineCache = pkgs.yarn-berry_4.fetchYarnBerryDeps {
      inherit (finalAttrs) src missingHashes;
      hash = "sha256-BQ+oaNZeCDC0Z1Iy7E56t1FVttQtkDz+CRh4e51lzls=";
    };

    nativeBuildInputs = [
      nodejs
      pkgs.yarn-berry_4
      pkgs.yarn-berry_4.yarnBerryConfigHook
      pkgs.python3
      pkgs.jq
    ];

    # Only doc-site uses sharp, and its install script downloads libvips, which a Nix build can't do
    postPatch = ''
      jq '.dependenciesMeta.sharp.built = false' package.json > package.json.tmp
      mv package.json.tmp package.json
    '';

    env = {
      HUSKY = "0";
      REVISION = revision;
    };

    buildPhase = ''
      runHook preBuild
      yarn run build:framework
      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall
      cp -r build/framework/client $out
      runHook postInstall
    '';
  });

  # Directories the app writes to at runtime. The image has writable copies of them here, which the app links to.
  stateDir = "/var/intercode";
  writableDirs = [
    # prepareStaticShell.sh copies this, permissions and all, so it can't be read-only
    "build"
    "log"
    "public"
    "storage"
    "tmp"
  ];

  # The `build` stage. The app runs from its store path, so it's built there too: Bootsnap keys its cache on each
  # file's absolute path and mtime.
  app = pkgs.stdenv.mkDerivation {
    name = "intercode-app";
    inherit src;
    nativeBuildInputs = [ gems ];
    outputs = [
      "out"
      # The initial contents of the writable directories
      "state"
    ];

    env = {
      RAILS_ENV = "production";
      NODE_ENV = "production";
      BUNDLE_FROZEN = "1";
      BUNDLE_WITHOUT = "development:test";
      LANG = "C.UTF-8";
    };

    buildPhase = ''
      runHook preBuild
      export HOME=$TMPDIR
      export LD_LIBRARY_PATH=${runtimeLibraryPath}
      cp -r . $out
      cd $out
      rm -r doc-site
      # The mtime that Nix gives every file in the store once the build finishes
      find . -exec touch -h -d @1 {} +

      # Each gem directory in the environment is a symlink into that gem's own store path, and Ruby loads files by their
      # resolved paths, so those are what to precompile (rather than using --gemfile)
      # Rails engines also load code and locales from their app/ and config/ directories
      gemDirs=$(bundle exec ruby -e '
        dirs = Bundler.load.specs.flat_map { |gem| gem.full_require_paths + %w[app config].map { File.join(gem.full_gem_path, _1) } }
        puts dirs.select { Dir.exist?(_1) }.map { File.realpath(_1) }.uniq
      ')
      bundle exec bootsnap precompile app/ lib/ config/ $gemDirs
      DATABASE_URL=postgresql://fakehost/not_a_real_database AWS_S3_BUCKET=fakebucket \
        AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy \
        bundle exec rails assets:precompile

      mkdir -p build/framework
      cp -r ${frontend} build/framework/client
      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall
      mkdir $state
      for dir in ${toString writableDirs}; do
        if [ -e $dir ]; then mv $dir $state/$dir; else mkdir $state/$dir; fi
        ln -s ${stateDir}/$dir $dir
      done
      runHook postInstall
    '';

    # Leave `#!/usr/bin/env ruby` and friends alone, as in the Docker image
    dontPatchShebangs = true;
    dontFixup = true;
  };

  # ruby-vips loads these through FFI, and there is no ld.so cache to find them in
  runtimeLibraryPath = lib.makeLibraryPath [
    pkgs.vips
    pkgs.glib
  ];

  # `useradd www` in the Dockerfile
  nss = pkgs.dockerTools.fakeNss.override {
    extraPasswdLines = [ "www:x:1000:1000::/home/www:/bin/bash" ];
    extraGroupLines = [ "www:x:1000:" ];
  };

  ociImage = pkgs.dockerTools.streamLayeredImage {
    name = "intercode-nix";
    tag = "latest";

    contents = [
      gems
      nodejs
      nss
      pkgs.dockerTools.usrBinEnv
      pkgs.dockerTools.binSh
      pkgs.bashInteractive
      pkgs.coreutils
      pkgs.findutils
      pkgs.gnugrep
      pkgs.gnused
      pkgs.curl
      pkgs.iproute2
      pkgs.gosu
      pkgs.chamber
      pkgs.poppler-utils
      pkgs.vips
      pkgs.cacert
    ];

    # /usr/src/intercode is where entrypoint.sh and fly.toml expect to find the app
    fakeRootCommands = ''
      mkdir -p usr/src tmp home/www .${stateDir}
      chmod 1777 tmp
      ln -s ${app} usr/src/intercode
      cp -r ${app.state}/. .${stateDir}/
      chmod -R u+w .${stateDir}
      chown -R 1000:1000 .${stateDir} home/www
    '';

    config = {
      Entrypoint = [ "/usr/src/intercode/bin/entrypoint.sh" ];
      Cmd = [
        "bundle"
        "exec"
        "bin/rails"
        "server"
        "-p"
        "3000"
        "-b"
        "0.0.0.0"
      ];
      WorkingDir = "/usr/src/intercode";
      Env = [
        "PATH=/bin:/usr/bin"
        "LANG=C.UTF-8"
        "RAILS_ENV=production"
        "NODE_ENV=production"
        "REVISION=${revision}"
        "BUNDLE_FROZEN=1"
        "BUNDLE_WITHOUT=development:test"
        "LD_PRELOAD=${pkgs.jemalloc}/lib/libjemalloc.so.2"
        "LD_LIBRARY_PATH=${runtimeLibraryPath}"
        "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
        "TZDIR=${pkgs.tzdata}/share/zoneinfo"
        "FREEDESKTOP_MIME_TYPES_PATH=${pkgs.shared-mime-info}/share/mime/packages/freedesktop.org.xml"
      ];
    };
  };
in
{
  inherit frontend app ociImage;
}
