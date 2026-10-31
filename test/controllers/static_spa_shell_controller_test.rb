# frozen_string_literal: true
require "test_helper"

class StaticSpaShellControllerTest < ActionDispatch::IntegrationTest
  let(:browser) { "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36" }
  let(:index_html) do
    "<!DOCTYPE html><html><head><title>Static shell</title></head><body>static-shell-marker</body></html>"
  end

  before do
    create(:root_site)
    @shell_dir = Dir.mktmpdir
    File.write(File.join(@shell_dir, "index.html"), index_html)
  end

  after do
    ENV.delete("STATIC_SHELL_DIR")
    FileUtils.remove_entry(@shell_dir)
  end

  describe "without STATIC_SHELL_DIR" do
    it "keeps rendering the shell itself" do
      get "/events/foo", headers: { "User-Agent" => browser }

      assert_response :ok
      assert_not_includes response.body, "static-shell-marker"
      assert_includes response.body, 'data-react-class="AppRoot"'
    end
  end

  describe "with STATIC_SHELL_DIR" do
    before { ENV["STATIC_SHELL_DIR"] = @shell_dir }

    it "serves the static index.html to browsers, uncached by shared caches" do
      get "/events/foo", headers: { "User-Agent" => browser }

      assert_response :ok
      assert_equal index_html, response.body
      assert_equal "text/html", response.media_type
      assert_equal "no-cache", response.headers["Cache-Control"]
      assert_includes response.headers["Vary"], "User-Agent"
    end

    it "serves it to a request with no user agent" do
      get "/", headers: { "User-Agent" => "" }

      assert_equal index_html, response.body
    end

    it "serves the Open Graph document to crawlers instead" do
      get "/", headers: { "User-Agent" => "Twitterbot/1.0" }

      assert_response :ok
      assert_not_includes response.body, "static-shell-marker"
      assert_includes response.body, 'property="og:url"'
      assert_includes response.body, 'property="og:type"'
      assert_includes response.headers["Vary"], "User-Agent"
      assert_equal "max-age=0, private", response.headers["Cache-Control"]
    end

    it "uses the convention's name for a crawler on a convention domain" do
      convention = create(:convention)
      host! convention.domain

      get "/", headers: { "User-Agent" => "facebookexternalhit/1.1" }

      assert_includes response.body, "<title>#{convention.name}</title>"
      assert_includes response.body, %(content="http://#{convention.domain}/")
    end

    it "serves the static shell from /cdn-spa-shell too, for CloudFront" do
      get "/cdn-spa-shell"

      assert_response :ok
      assert_equal index_html, response.body
      assert_includes response.headers["Cache-Control"], "public"
    end

    it "leaves Rails routes alone" do
      get "/client_configuration"

      assert_response :ok
      assert response.parsed_body.key?("oidc_issuer_url")
    end
  end

  describe StaticSpaShell do
    it "recognizes every crawler in the shared routing list, and the iMessage user agent" do
      StaticSpaShell::ROUTING
        .fetch("crawler_user_agents")
        .each do |agent|
          assert StaticSpaShell.crawler?("Mozilla/5.0 (compatible; #{agent.upcase}/1.0)"), "expected #{agent} to match"
        end
      assert StaticSpaShell.crawler?(
               "Mozilla/5.0 (Macintosh) Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0"
             )
    end

    it "doesn't treat a browser as a crawler" do
      assert_not StaticSpaShell.crawler?(browser)
      assert_not StaticSpaShell.crawler?(nil)
    end
  end

  describe "the Devise pages" do
    after { ENV.delete("STATIC_SHELL_DIR") }

    %w[/users/sign_in /users/sign_up /users/password/new /users/password/edit?reset_password_token=abc].each do |path|
      it "serves #{path} from the static shell when there is one" do
        ENV["STATIC_SHELL_DIR"] = @shell_dir

        get path, headers: { "User-Agent" => browser }

        assert_response :ok
        assert_equal index_html, response.body
        assert_equal "no-cache", response.headers["Cache-Control"]
      end

      it "renders #{path} itself without one" do
        get path, headers: { "User-Agent" => browser }

        assert_response :ok
        assert_not_includes response.body, "static-shell-marker"
      end
    end
  end
end
