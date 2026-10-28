# frozen_string_literal: true
require "test_helper"

class ClientConfigurationControllerTest < ActionDispatch::IntegrationTest
  it "serves the OIDC endpoints same-origin so the SPA needn't fetch cross-origin discovery" do
    get "/client_configuration"

    assert_response :ok
    config = response.parsed_body
    issuer = config["oidc_issuer_url"]

    assert issuer.present?, "expected an issuer URL"
    # Endpoints are absolute URLs on the *issuer* host (not whatever host requested this),
    # built from the issuer so a convention page gets the root-site endpoints.
    assert config["oidc_authorization_endpoint"].start_with?(issuer)
    assert config["oidc_authorization_endpoint"].end_with?("/oauth/authorize")
    assert config["oidc_end_session_endpoint"].start_with?(issuer)
    assert config["oidc_end_session_endpoint"].end_with?("/users/sign_out")
  end

  it "sends no convention block on the root site" do
    get "/client_configuration"

    assert_response :ok
    assert_nil response.parsed_body["convention"]
  end

  describe "on a convention's domain" do
    let(:convention) { create(:convention) }

    before { host! convention.domain }
    after { ENV.delete("UPLOADS_HOST") }

    it "sends the convention's name, with null images when it has none" do
      get "/client_configuration"

      assert_response :ok
      assert_equal(
        {
          "name" => convention.name,
          "favicon_url" => nil,
          "favicon_content_type" => nil,
          "open_graph_image_url" => nil
        },
        response.parsed_body["convention"]
      )
    end

    it "sends the favicon and Open Graph image URLs when attached" do
      convention.favicon.attach(
        io: StringIO.new("<svg xmlns='http://www.w3.org/2000/svg'/>"),
        filename: "favicon.svg",
        content_type: "image/svg+xml"
      )
      convention.open_graph_image.attach(io: StringIO.new("png"), filename: "og.png", content_type: "image/png")

      # cdn_upload_url refuses to build a URL without an uploads host
      ENV["UPLOADS_HOST"] = "uploads.example.test"
      get "/client_configuration"

      assert_response :ok
      config = response.parsed_body["convention"]
      assert_equal "image/svg+xml", config["favicon_content_type"]
      assert_includes config["favicon_url"], "favicon.svg"
      assert_includes config["open_graph_image_url"], "og.png"
    end
  end
end
