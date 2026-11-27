# frozen_string_literal: true
require "test_helper"

class DoorkeeperSpaShellTest < ActionDispatch::IntegrationTest
  let(:user) { create(:user) }
  let(:application) { create(:oauth_application) }
  let(:authorization_params) do
    {
      client_id: application.uid,
      redirect_uri: application.redirect_uri,
      response_type: "code",
      scope: "public",
      state: "some-state",
      code_challenge: "a" * 43,
      code_challenge_method: "S256"
    }
  end
  let(:index_html) { "<!DOCTYPE html><html><body>static-shell-marker</body></html>" }

  before do
    create(:root_site)
    @original_shell_dir = ENV.fetch("STATIC_SHELL_DIR", nil)
    ENV.delete("STATIC_SHELL_DIR")
  end

  after { ENV["STATIC_SHELL_DIR"] = @original_shell_dir }

  def assert_static_shell
    assert_equal index_html, response.body
    assert_equal "text/html", response.media_type
    assert_equal "no-cache", response.headers["Cache-Control"]
  end

  def assert_rails_shell
    assert_equal "text/html", response.media_type
    assert_includes response.body, 'data-react-class="AppRoot"'
  end

  { "with" => true, "without" => false }.each do |description, static|
    describe "#{description} STATIC_SHELL_DIR" do
      before do
        if static
          @shell_dir = Dir.mktmpdir
          File.write(File.join(@shell_dir, "index.html"), index_html)
          ENV["STATIC_SHELL_DIR"] = @shell_dir
        end
        sign_in user
      end

      after { FileUtils.remove_entry(@shell_dir) if @shell_dir }

      define_method(:assert_shell) { static ? assert_static_shell : assert_rails_shell }

      it "serves the SPA shell as the consent page" do
        get oauth_authorization_path(authorization_params)

        assert_response :ok
        assert_shell
      end

      it "serves the SPA shell for an authorization error, keeping the error status" do
        get oauth_authorization_path(authorization_params.merge(client_id: "nonexistent"))

        assert_response :unauthorized
        assert_shell
      end

      it "serves the SPA shell as the authorized applications page" do
        get oauth_authorized_applications_path

        assert_response :ok
        assert_shell
      end
    end
  end

  describe "with the frontend development server" do
    before do
      ENV["FRONTEND_DEV_SERVER_PORT"] = "3135"
      sign_in user
    end

    after { ENV.delete("FRONTEND_DEV_SERVER_PORT") }

    it "redirects an authorization error there, rather than keeping the error status" do
      path = oauth_authorization_path(authorization_params.merge(client_id: "nonexistent"))

      get path

      assert_response :redirect
      assert_equal "https://www.example.com:3135#{path}", response.location
    end
  end

  describe "the responses that are not SPA pages" do
    before { sign_in user }

    it "redirects to the sign-in page when nobody is signed in" do
      sign_out user

      get oauth_authorization_path(authorization_params)

      assert_redirected_to new_user_session_url
    end

    it "skips the consent page for the first-party frontend" do
      application.update!(is_intercode_frontend: true)
      # The frontend's redirect URIs are derived from the convention domains
      redirect_uri = "https://#{create(:convention).domain}/oauth/callback"

      get oauth_authorization_path(authorization_params.merge(redirect_uri:))

      assert_response :redirect
      assert response.location.start_with?(redirect_uri)
      assert_includes response.location, "code="
    end

    it "redirects back to the client when the user authorizes it" do
      post oauth_authorization_path, params: authorization_params

      assert_response :redirect
      assert_includes response.location, "code="
    end

    it "redirects back to the client when the user denies it" do
      delete oauth_authorization_path, params: authorization_params

      assert_response :redirect
      assert_includes response.location, "error=access_denied"
    end

    it "renders Doorkeeper's self-submitting form for response_mode=form_post" do
      post oauth_authorization_path, params: authorization_params.merge(response_mode: "form_post")

      assert_response :ok
      assert_select "form[name=redirect_form][action=?]", application.redirect_uri do
        assert_select "input[name=code]"
        assert_select "input[name=state][value=some-state]"
      end
    end

    it "answers JSON requests for the authorized applications with JSON" do
      get oauth_authorized_applications_path(format: :json)

      assert_response :ok
      assert_equal "application/json", response.media_type
    end

    it "redirects after revoking an application" do
      delete oauth_authorized_application_path(application.id)

      assert_redirected_to oauth_authorized_applications_url
    end
  end
end
