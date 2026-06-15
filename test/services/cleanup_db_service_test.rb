# frozen_string_literal: true
require "test_helper"

class CleanupDbServiceTest < ActiveSupport::TestCase
  let(:user) { create(:user) }
  # A frontend app derives its redirect_uri from existing convention domains, so one must exist.
  let(:convention) { create(:convention) }
  let(:frontend_app) do
    convention
    create(:oauth_application, is_intercode_frontend: true)
  end
  let(:other_app) { create(:oauth_application) }

  def create_token(application:, revoked_at: nil)
    token =
      Doorkeeper::AccessToken.create!(
        application: application,
        resource_owner_id: user.id,
        scopes: "public",
        expires_in: 1.hour,
        use_refresh_token: true
      )
    token.update_column(:revoked_at, revoked_at) if revoked_at # rubocop:disable Rails/SkipsModelValidations
    token
  end

  describe "revoked access token cleanup with the frontend grace period" do
    it "spares the frontend app's recently-revoked tokens but deletes the rest" do
      recent_frontend = create_token(application: frontend_app, revoked_at: 1.hour.ago)
      old_frontend = create_token(application: frontend_app, revoked_at: 5.days.ago)
      active_frontend = create_token(application: frontend_app)
      recent_other = create_token(application: other_app, revoked_at: 1.hour.ago)

      CleanupDbService.new.call!

      assert Doorkeeper::AccessToken.exists?(recent_frontend.id), "recently-revoked frontend token should be kept"
      assert Doorkeeper::AccessToken.exists?(active_frontend.id), "active frontend token should be kept"
      assert_not Doorkeeper::AccessToken.exists?(old_frontend.id), "frontend token revoked beyond grace is deleted"
      assert_not Doorkeeper::AccessToken.exists?(recent_other.id), "non-frontend revoked token is deleted"
    end
  end
end
