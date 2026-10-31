# frozen_string_literal: true
require "test_helper"

class StaticSpaShellTest < ActiveSupport::TestCase
  describe ".stylesheet_hrefs" do
    after { ENV.delete("STATIC_SHELL_DIR") }

    it "is empty without a shell" do
      ENV.delete("STATIC_SHELL_DIR")

      assert_equal [], StaticSpaShell.stylesheet_hrefs
    end

    it "lists the stylesheets the shell links, and nothing else" do
      Dir.mktmpdir do |dir|
        File.write(File.join(dir, "index.html"), <<~HTML)
          <!DOCTYPE html><html><head>
          <link rel="modulepreload" href="/assets/entry.client-abc.js"/>
          <link rel="stylesheet" href="https://assets.example.com/assets/entry-abc.css"/>
          <link rel="stylesheet" href="/assets/other-def.css#"/>
          </head><body></body></html>
        HTML
        ENV["STATIC_SHELL_DIR"] = dir

        assert_equal %w[https://assets.example.com/assets/entry-abc.css /assets/other-def.css#],
                     StaticSpaShell.stylesheet_hrefs
      end
    end
  end
end
