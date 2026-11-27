# frozen_string_literal: true

require "test_helper"

class FrontendDevServerShellControllerTest < ActionDispatch::IntegrationTest
  PORT = 3135

  let(:convention) { create(:convention) }

  before do
    create(:root_site)
    ENV["FRONTEND_DEV_SERVER_PORT"] = PORT.to_s
    https!
  end

  after { ENV.delete("FRONTEND_DEV_SERVER_PORT") }

  # The page would be fetched from the development server, which isn't running in tests
  def get_with_dev_server_page(path)
    FrontendDevServer.stub(:shell, "<html>the dev server's page</html>") { get path }
  end

  it "serves the development server's page to requests that came through its proxy" do
    host! "#{convention.domain}:#{PORT}"
    get_with_dev_server_page "/users/123"

    assert_response :success
    assert_equal "text/html", response.media_type
    assert_equal "no-cache", response.headers["Cache-Control"]
    assert_includes response.body, "the dev server's page"
  end

  it "redirects requests that came to Rails directly to the development server" do
    host! "#{convention.domain}:5050"
    get_with_dev_server_page "/events?page=2"

    assert_redirected_to "https://#{convention.domain}:#{PORT}/events?page=2"
  end

  it "does the same for the Devise pages" do
    host! "#{convention.domain}:5050"
    get_with_dev_server_page "/users/sign_in"

    assert_redirected_to "https://#{convention.domain}:#{PORT}/users/sign_in"

    host! "#{convention.domain}:#{PORT}"
    get_with_dev_server_page "/users/sign_in"

    assert_includes response.body, "the dev server's page"
  end
end
