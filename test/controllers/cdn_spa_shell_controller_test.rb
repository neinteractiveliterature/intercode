# frozen_string_literal: true
require "test_helper"

class CdnSpaShellControllerTest < ActionDispatch::IntegrationTest
  it "preloads the requests the SPA makes at boot, ahead of its entry script" do
    get "/cdn-spa-shell"

    assert_response :ok
    html = response.body
    entry_index = html.index('type="module"')

    %w[/client_configuration /authenticity_tokens].each do |path|
      preload = html.index(%(<link rel="preload" href="#{path}" as="fetch" crossorigin="anonymous"/>))

      assert preload, "expected a preload link for #{path}"
      assert_operator preload, :<, entry_index, "expected the #{path} preload to come before the entry script"
    end
  end

  it "starts redeeming the refresh cookie before the entry script loads" do
    get "/cdn-spa-shell"

    assert_response :ok
    html = response.body
    early_refresh = html.index("window.intercodeEarlyRefresh = fetch('/oauth_session/refresh'")

    assert early_refresh, "expected the shell to start the refresh request"
    assert_operator early_refresh, :<, html.index('type="module"')
  end

  it "reloads once if the entry script fails to load" do
    get "/cdn-spa-shell"

    assert_response :ok
    script_tag = response.body.scan(/<script[^>]*>/).find { |tag| tag.include?("packs/application.js") }

    assert script_tag, "expected the shell to include the entry script"
    assert_includes script_tag, "onerror="
    assert_includes script_tag, "location.reload()"
  end
end
