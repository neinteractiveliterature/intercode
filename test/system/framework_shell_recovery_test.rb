# frozen_string_literal: true
require "application_system_test_case"

# What the framework-mode shell does when a file it names is gone (see app/javascript/shellRecovery.ts): reload once,
# then show a plain message, since the app that would normally show its error UI never loaded. Like
# FrameworkShellTest, it only runs against the framework build (see that file for how to set it up).
class FrameworkShellRecoveryTest < ApplicationSystemTestCase
  # The failed import of the entry file is an uncaught error in the page, which is the thing under test here, so this
  # uses a copy of the driver that doesn't turn page errors into test failures
  Capybara.register_driver(:cuprite_without_js_errors) do |app|
    Capybara::Cuprite::Driver.new(
      app,
      window_size: [1200, 800],
      headless: %w[0 false].exclude?(ENV.fetch("HEADLESS", nil)),
      js_errors: false
    )
  end

  driven_by :cuprite_without_js_errors

  let(:root_site) { create(:root_site) }
  let(:convention) { create(:convention, :with_standard_content) }

  before do
    skip "Set STATIC_SHELL_DIR to run the framework-mode shell tests" unless StaticSpaShell.enabled?

    root_site
    Intercode.overridden_virtual_host_domain = convention.domain
  end

  after { Intercode.overridden_virtual_host_domain = nil }

  # Runs the block with a copy of the shell whose index.html asks for a file that doesn't exist, as a cached shell from
  # before a release would once that release's files have been removed
  def with_shell_missing(asset_prefix)
    original_dir = StaticSpaShell.directory
    Dir.mktmpdir do |dir|
      FileUtils.cp_r("#{original_dir}/.", dir)
      index = File.join(dir, "index.html")
      html = File.read(index)
      pattern = %r{(/assets/#{asset_prefix})-[\w-]+\.js}
      assert_match(pattern, html)
      File.write(index, html.gsub(pattern, '\1-gone.js'))

      ENV["STATIC_SHELL_DIR"] = dir
      yield
    ensure
      ENV["STATIC_SHELL_DIR"] = original_dir
    end
  end

  def document_requests
    # The traffic log can include entries without a URL (this showed up on CI), so skip those
    urls = page.driver.network_traffic.filter_map(&:url)
    urls.count { |url| URI.parse(url).path == "/framework-check" }
  end

  it "reloads once when the entry file is missing, then shows a message" do
    with_shell_missing("entry.client") do
      visit "/framework-check"

      assert page.has_content?("We couldn’t finish loading this page")
      assert page.has_button?("Reload the page")
      assert_equal 2, document_requests
    end
  end

  it "reloads once when the manifest is missing, then shows a message" do
    with_shell_missing("manifest") do
      visit "/framework-check"

      assert page.has_content?("We couldn’t finish loading this page")
      assert_equal 2, document_requests
    end
  end

  it "does not show the message when everything loads" do
    visit "/framework-check"

    assert page.has_content?("Framework mode")
    assert page.has_no_content?("We couldn’t finish loading this page")
    assert_equal 1, document_requests
  end
end
