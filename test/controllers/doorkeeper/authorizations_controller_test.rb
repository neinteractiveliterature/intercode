# frozen_string_literal: true
require "test_helper"

class DoorkeeperAuthorizationsControllerTest < ActionDispatch::IntegrationTest
  describe "GET /oauth/authorize" do
    let(:user) { create(:user) }
    let(:application) { create(:oauth_application) }

    before do
      create(:root_site)
      sign_in user
    end

    it "renders the authorization prompt instead of raising a 500" do
      get oauth_authorization_path(
            client_id: application.uid,
            redirect_uri: application.redirect_uri,
            response_type: "code",
            scope: "public"
          )

      assert_response :success
    end
  end
end
