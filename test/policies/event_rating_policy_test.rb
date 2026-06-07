# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class EventRatingPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  FakeToken =
    Struct.new(:scopes) do
      def self.with_scopes(*scopes)
        new(Doorkeeper::OAuth::Scopes.from_array(scopes.map(&:to_s)))
      end
    end

  let(:event_rating) { create(:event_rating) }

  # rubocop:disable Metrics/BlockLength
  %w[read manage].each do |action|
    it "does not allow logged out users to #{action} event ratings" do
      assert_not EventRatingPolicy.new(nil, event_rating).send("#{action}?")
    end

    it "allows users to #{action} their own event ratings" do
      assert EventRatingPolicy.new(event_rating.user_con_profile.user, event_rating).send("#{action}?")

      # Event ratings are secret from identity assumers
      assert_not EventRatingPolicy.new(
                   create_identity_assumer(
                     event_rating.user_con_profile.user,
                     event_rating.user_con_profile.convention
                   ),
                   event_rating
                 ).send("#{action}?")
      assert_not EventRatingPolicy.new(
                   create_identity_assumer_from_other_convention(event_rating.user_con_profile.user),
                   event_rating
                 ).send("#{action}?")
    end

    it "does not allow users to #{action} other people's event ratings" do
      assert_not EventRatingPolicy.new(create(:user), event_rating).send("#{action}?")
    end

    it "does not allow site admins to #{action} other people's event ratings" do
      assert_not EventRatingPolicy.new(create(:site_admin), event_rating).send("#{action}?")
    end

    it "does not allow site admins to #{action} other people's event ratings even under assumed identities" do
      admin_profile =
        create(:user_con_profile, convention: event_rating.user_con_profile.convention, user: create(:site_admin))
      authorization_info =
        AuthorizationInfo.new(event_rating.user_con_profile.user, nil, assumed_identity_from_profile: admin_profile)
      assert_not EventRatingPolicy.new(authorization_info, event_rating).send("#{action}?")
    end
  end
  # rubocop:enable Metrics/BlockLength

  it "allows users to read their own event ratings over OAuth with read_signups scope" do
    authorization_info = AuthorizationInfo.new(event_rating.user_con_profile.user, FakeToken.with_scopes(:read_signups))
    assert EventRatingPolicy.new(authorization_info, event_rating).read?
  end

  it "does not allow users to read their own event ratings over OAuth without read_signups scope" do
    authorization_info = AuthorizationInfo.new(event_rating.user_con_profile.user, FakeToken.with_scopes(:public))
    assert_not EventRatingPolicy.new(authorization_info, event_rating).read?
  end

  it "allows users to manage their own event ratings over OAuth with manage_signups scope" do
    authorization_info =
      AuthorizationInfo.new(event_rating.user_con_profile.user, FakeToken.with_scopes(:manage_signups))
    assert EventRatingPolicy.new(authorization_info, event_rating).manage?
  end

  it "does not allow users to manage their own event ratings over OAuth without manage_signups scope" do
    authorization_info = AuthorizationInfo.new(event_rating.user_con_profile.user, FakeToken.with_scopes(:public))
    assert_not EventRatingPolicy.new(authorization_info, event_rating).manage?
  end
end
