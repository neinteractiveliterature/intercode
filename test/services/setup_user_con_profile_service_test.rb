# frozen_string_literal: true
require "test_helper"

class SetupUserConProfileServiceTest < ActiveSupport::TestCase
  let(:organization) { create(:organization) }
  let(:convention) { create(:convention, :with_standard_content, organization:) }
  let(:user) { create(:user, first_name: "Newcomer", last_name: "Attendee") }

  def earlier_convention(years_ago:, **attributes)
    create(
      :convention,
      :with_standard_content,
      organization:,
      starts_at: years_ago.years.ago,
      ends_at: years_ago.years.ago + 3.days,
      **attributes
    )
  end

  def setup_profile(convention: self.convention)
    SetupUserConProfileService.new(convention:, user:).call!.user_con_profile
  end

  describe "a new profile" do
    it "is saved, for the user at the convention, with the user's name" do
      profile = setup_profile

      assert profile.persisted?
      assert_equal user, profile.user
      assert_equal convention, profile.convention
      assert_equal "Newcomer", profile.first_name
      assert_equal "Attendee", profile.last_name
    end

    it "is marked as needing an update, so the attendee is asked to check it" do
      assert setup_profile.needs_update
    end

    it "takes default values from the profile form" do
      profile = setup_profile

      # (the standard form defaults these two to true)
      assert profile.allow_sms
      assert profile.receive_whos_free_emails
    end

    it "returns a successful result with the profile" do
      result = SetupUserConProfileService.new(convention:, user:).call

      assert result.success?
      assert_kind_of UserConProfile, result.user_con_profile
    end

    it "fails if the user already has a profile at the convention" do
      create(:user_con_profile, convention:, user:)

      result = SetupUserConProfileService.new(convention:, user:).call

      assert_not result.success?
    end
  end

  describe "copying from earlier conventions of the same organization" do
    it "brings over the details that the new profile form asks for" do
      create(
        :user_con_profile,
        convention: earlier_convention(years_ago: 2),
        user:,
        city: "Providence",
        state: "RI",
        mobile_phone: "401-555-0100"
      )

      profile = setup_profile

      assert_equal "Providence", profile.city
      assert_equal "RI", profile.state
      assert_equal "401-555-0100", profile.mobile_phone
    end

    it "brings over whether the attendee uses Gravatar" do
      create(:user_con_profile, convention: earlier_convention(years_ago: 2), user:, gravatar_enabled: true)

      assert setup_profile.gravatar_enabled
    end

    it "prefers the most recent convention when several have a value" do
      create(:user_con_profile, convention: earlier_convention(years_ago: 4), user:, city: "Old City")
      create(:user_con_profile, convention: earlier_convention(years_ago: 2), user:, city: "Newer City")

      assert_equal "Newer City", setup_profile.city
    end

    it "still marks the copied profile as needing an update" do
      create(:user_con_profile, convention: earlier_convention(years_ago: 2), user:, city: "Providence")

      assert setup_profile.needs_update
    end

    it "does not copy from conventions of another organization" do
      other_organization_convention =
        create(
          :convention,
          :with_standard_content,
          organization: create(:organization),
          starts_at: 2.years.ago,
          ends_at: 2.years.ago + 3.days
        )
      create(:user_con_profile, convention: other_organization_convention, user:, city: "Elsewhere")

      assert_nil setup_profile.city
    end

    it "does not copy from other people's profiles" do
      create(:user_con_profile, convention: earlier_convention(years_ago: 2), city: "Somebody Else's City")

      assert_nil setup_profile.city
    end

    it "copies nothing for a convention that is not part of an organization" do
      standalone = create(:convention, :with_standard_content, organization: nil)
      create(:user_con_profile, convention: earlier_convention(years_ago: 2), user:, city: "Providence")

      assert_nil setup_profile(convention: standalone).city
    end

    it "copies nothing the first time" do
      assert_nil setup_profile.city
    end
  end
end
