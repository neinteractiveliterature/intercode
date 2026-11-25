# frozen_string_literal: true
require "application_system_test_case"

# Boots the framework-mode build in a real browser, with Rails serving the prebuilt shell (see StaticSpaShell). Run
# script/prepareStaticShell.sh after yarn build:framework, then set STATIC_SHELL_DIR to the directory it prints.
# Skipped without it, so the rest of the system tests keep running against the Rails-rendered shell.
#
# This only covers what the framework build has so far (its placeholder /framework-check page, which runs the
# same bootstrap and AppRoot query as the app); the other system tests will run against it once the routes have moved.
class FrameworkShellTest < ApplicationSystemTestCase
  let(:root_site) { create(:root_site) }
  let(:convention) { create(:convention, :with_standard_content) }

  before do
    skip "Set STATIC_SHELL_DIR to run the framework-mode shell tests" unless StaticSpaShell.enabled?

    root_site
    Intercode.overridden_virtual_host_domain = convention.domain
  end

  after { Intercode.overridden_virtual_host_domain = nil }

  it "boots and shows that nobody is signed in" do
    visit "/framework-check"
    assert page.has_content?("Framework mode")
    assert page.has_content?("Not signed in")
  end

  # The shell starts these itself, before the entry script has downloaded (see app/javascript/bootPreloads.js), and the
  # app takes them over instead of asking again
  it "makes each boot request once, starting before the entry script has run" do
    visit "/framework-check"
    assert page.has_content?("Not signed in")

    %w[/client_configuration /authenticity_tokens /oauth_session/refresh].each do |path|
      assert_equal 1, requests_for(path), "expected exactly one request for #{path}"
    end
    assert_equal(
      %w[/authenticity_tokens /client_configuration /oauth_session/refresh],
      page.evaluate_script(<<~JS).sort
        performance.getEntriesByType('resource')
          .filter((entry) => entry.startTime < performance.getEntriesByType('resource')
            .find((other) => other.name.includes('/assets/entry.client')).responseEnd)
          .map((entry) => new URL(entry.name).pathname)
          .filter((path) => ['/client_configuration', '/authenticity_tokens', '/oauth_session/refresh'].includes(path))
      JS
    )
  end

  it "shows the convention's favicon" do
    convention.favicon.attach(
      io: StringIO.new("<svg xmlns='http://www.w3.org/2000/svg'/>"),
      filename: "favicon.svg",
      content_type: "image/svg+xml"
    )
    # cdn_upload_url refuses to build a URL without an uploads host
    original_uploads_host = ENV.fetch("UPLOADS_HOST", nil)
    ENV["UPLOADS_HOST"] = "uploads.example.test"

    visit "/framework-check"
    assert page.has_content?("Not signed in")

    assert page.has_css?("head link[rel='icon'][type='image/svg+xml'][href*='favicon.svg']", visible: :all, count: 1)
    assert_equal convention.name, page.title
  ensure
    ENV["UPLOADS_HOST"] = original_uploads_host
  end

  # With scripts off, the page is the shell as it looks while the app is still downloading
  it "shows a loading spinner before the app's scripts have run" do
    page.driver.browser.page.command("Emulation.setScriptExecutionDisabled", value: true)

    visit "/framework-check"

    assert page.has_css?(".custom-loading-indicator .spinner-border", visible: :visible)
    assert page.has_no_content?("Framework mode")
  end

  # Nothing on screen depends on these, so they shouldn't compete with the files that it does (see
  # app/javascript/contentShown.ts)
  it "loads the search box and Bootstrap's JavaScript only once the page's content is there" do
    page.driver.browser.evaluate_on_new_document(<<~JS)
      new MutationObserver((_, observer) => {
        if (document.querySelector('.site-search-navigation-button')) {
          window.contentRenderedAt = performance.now();
          observer.disconnect();
        }
      }).observe(document, { childList: true, subtree: true });
    JS

    visit "/"

    assert page.has_css?(".site-search", visible: :all)
    started_after_content = <<~'JS'
      performance.getEntriesByType('resource')
        .filter((entry) => /\/assets\/(SiteSearch|Select|bootstrap\.esm)[^\/]*\.js$/.test(entry.name))
        .map((entry) => [
          entry.name.split('/assets/')[1].split(/[-.]/)[0],
          entry.startTime > window.contentRenderedAt,
        ])
        .sort()
    JS
    assert_equal [["Select", true], ["SiteSearch", true], ["bootstrap", true]],
                 page.evaluate_script(started_after_content)

    find(".site-search-navigation-button").click
    assert page.has_css?(".site-search input:focus", visible: :all)
  end

  def requests_for(path)
    page.driver.network_traffic.filter_map(&:url).count { |url| URI.parse(url).path == path }
  end

  it "boots with the signed-in user's session" do
    user_con_profile = create(:user_con_profile, convention:)
    sign_in user_con_profile.user

    visit "/framework-check"
    assert page.has_content?("Signed in as #{user_con_profile.user.name}")
  end
end
