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
end
