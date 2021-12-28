require 'test_helper'
require_relative 'convention_permissions_test_helper'

class EventRatingPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:event_rating) { create(:event_rating) }

  %w[read manage].each do |action|
    it "does not allow logged out users to #{action} event ratings" do
      refute EventRatingPolicy.new(nil, event_rating).send("#{action}?")
    end

    it "allows users to #{action} their own event ratings" do
      assert EventRatingPolicy.new(event_rating.user_con_profile.user, event_rating).send("#{action}?")

      # Event ratings are secret from identity assumers
      refute EventRatingPolicy
               .new(
                 create_identity_assumer(event_rating.user_con_profile.user, event_rating.user_con_profile.convention),
                 event_rating
               )
               .send("#{action}?")
      refute EventRatingPolicy
               .new(create_identity_assumer_from_other_convention(event_rating.user_con_profile.user), event_rating)
               .send("#{action}?")
    end

    it "does not allow users to #{action} their own event ratings over OAuth" do
      authorization_info = AuthorizationInfo.new(event_rating.user_con_profile.user, :fake_token)
      refute EventRatingPolicy.new(authorization_info, event_rating).send("#{action}?")
    end

    it "does not allow users to #{action} their own event ratings over OAuth" do
      authorization_info = AuthorizationInfo.new(event_rating.user_con_profile.user, :fake_token)
      refute EventRatingPolicy.new(authorization_info, event_rating).send("#{action}?")
    end

    it "does not allow users to #{action} other people's event ratings" do
      refute EventRatingPolicy.new(create(:user), event_rating).send("#{action}?")
    end

    it "does not allow site admins to #{action} other people's event ratings" do
      refute EventRatingPolicy.new(create(:site_admin), event_rating).send("#{action}?")
    end

    it "does not allow site admins to #{action} other people's event ratings even under assumed identities" do
      admin_profile =
        create(:user_con_profile, convention: event_rating.user_con_profile.convention, user: create(:site_admin))
      authorization_info =
        AuthorizationInfo.new(event_rating.user_con_profile.user, nil, assumed_identity_from_profile: admin_profile)
      refute EventRatingPolicy.new(authorization_info, event_rating).send("#{action}?")
    end
  end
end
