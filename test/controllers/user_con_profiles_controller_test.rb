# frozen_string_literal: true
# rubocop:disable Metrics/BlockLength
require "test_helper"

describe UserConProfilesController do
  let(:user_con_profile) { create(:user_con_profile) }
  let(:convention) { user_con_profile.convention }
  let(:con_admin_staff_position) { create(:admin_staff_position, convention: convention) }
  let(:con_admin_profile) do
    profile = create(:user_con_profile, convention: convention)
    con_admin_staff_position.user_con_profiles << profile
    profile
  end
  let(:con_admin) { con_admin_profile.user }
  let(:frontend_app) { create(:oauth_application, is_intercode_frontend: true) }

  setup do
    set_convention convention
    sign_in con_admin
    user_con_profile
    frontend_app
  end

  describe "POST become" do
    it "creates an assumed identity session and issues an OAuth session for the assumed user" do
      OAuthApplication.stub(:find_by, frontend_app) do
        assert_difference("AssumedIdentitySession.count", 1) do
          assert_difference("Doorkeeper::AccessToken.count", 1) do
            post :become, params: { id: user_con_profile.id, justification: "testing become" }
          end
        end
      end

      assert_redirected_to root_url

      new_token = Doorkeeper::AccessToken.last
      assert_equal user_con_profile.user.id, new_token.resource_owner_id
      assert_equal frontend_app.id, new_token.application_id
    end

    it "revokes the admin's previous OAuth session cookie when one exists" do
      admin_token =
        Doorkeeper::AccessToken.create!(
          application: frontend_app,
          resource_owner_id: con_admin.id,
          scopes: "public",
          expires_in: 2.weeks,
          use_refresh_token: true
        )
      @request.cookies[OAuthSessionManagement::REFRESH_COOKIE_NAME] = admin_token.plaintext_refresh_token

      OAuthApplication.stub(:find_by, frontend_app) do
        post :become, params: { id: user_con_profile.id, justification: "testing cookie revocation" }
      end

      assert admin_token.reload.revoked?, "Expected the admin's previous OAuth token to be revoked"
    end
  end

  describe "POST revert_become" do
    setup do
      OAuthApplication.stub(:find_by, frontend_app) do
        post :become, params: { id: user_con_profile.id, justification: "setup for revert test" }
      end
    end

    it "reverts to the original admin user and issues a new OAuth session for them" do
      assumed_user_token = Doorkeeper::AccessToken.last

      OAuthApplication.stub(:find_by, frontend_app) do
        assert_difference("Doorkeeper::AccessToken.count", 1) { post :revert_become }
      end

      assert_redirected_to root_url

      new_token = Doorkeeper::AccessToken.last
      assert_equal con_admin.id, new_token.resource_owner_id
      assert assumed_user_token.reload.revoked?, "Expected the assumed user's OAuth token to be revoked after revert"
    end
  end
end
# rubocop:enable Metrics/BlockLength
