# frozen_string_literal: true

require_relative "lib/intercode_warp_core/version"

Gem::Specification.new do |spec|
  spec.name = "intercode_warp_core"
  spec.version = IntercodeWarpCore::VERSION
  spec.authors = ["Nat Budin"]
  spec.email = ["natbudin@gmail.com"]

  spec.summary = "The Rust parts of Intercode"
  spec.homepage = "https://intercode.interactiveliterature.org"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 2.6.0"
  spec.required_rubygems_version = ">= 3.3.11"

  spec.metadata["allowed_push_host"] = "TODO: Set to your gem server 'https://example.com'"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/neinteractiveliterature/intercode"
  spec.metadata["changelog_uri"] = "https://github.com/neinteractiveliterature/intercode/blob/main/intercode_warp_core/CHANGELOG.md"

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files = Dir.chdir(__dir__) do
    `git ls-files -z`.split("\x0").reject do |f|
      (f == __FILE__) || f.match(%r{\A(?:(?:bin|test|spec|features)/|\.(?:git|circleci)|appveyor)})
    end
  end
  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]
  spec.extensions = ["ext/intercode_warp_core/Cargo.toml"]

  # Uncomment to register a new dependency of your gem
  # spec.add_dependency "example-gem", "~> 1.0"

  # For more information and examples about making a new gem, check out our
  # guide at: https://bundler.io/guides/creating_gem.html
end
