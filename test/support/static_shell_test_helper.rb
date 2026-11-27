# frozen_string_literal: true

# For tests of pages that the frontend renders: gives Rails a static shell to serve (see StaticSpaShell), as production
# has. Include it and call `use_static_shell` in a describe block.
module StaticShellTestHelper
  INDEX_HTML = "<!DOCTYPE html><html><body>static-shell-marker</body></html>"

  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def use_static_shell
      before do
        @original_shell_dir = ENV.fetch("STATIC_SHELL_DIR", nil)
        @shell_dir = Dir.mktmpdir
        File.write(File.join(@shell_dir, "index.html"), INDEX_HTML)
        ENV["STATIC_SHELL_DIR"] = @shell_dir
      end

      after do
        ENV["STATIC_SHELL_DIR"] = @original_shell_dir
        FileUtils.remove_entry(@shell_dir)
      end
    end
  end
end
