require "test_helper"

class ConventionReportsPresenterTest < ActiveSupport::TestCase
  let(:organization) { create(:organization) }
  let(:convention) { create(:convention, organization:, ticket_mode: "required_for_signup") }
  let(:other_convention) { create(:convention, organization:, ticket_mode: "required_for_signup") }
  let(:presenter) { ConventionReportsPresenter.new(convention) }

  describe "#new_and_returning_attendees" do
    it "returns a new attendee who only has a ticket at this convention" do
      profile = create(:user_con_profile, convention:)
      create(:ticket, user_con_profile: profile)

      result = presenter.new_and_returning_attendees
      counts = result[:organization_attendance_counts]

      assert_equal 1, counts.length
      assert_equal profile, counts.first.current_convention_user_con_profile
      assert_equal 1, counts.first.attended_convention_ids.length
    end

    it "returns a returning attendee who also has a ticket at another org convention" do
      user = create(:user)
      profile = create(:user_con_profile, convention:, user:)
      create(:ticket, user_con_profile: profile)

      other_profile = create(:user_con_profile, convention: other_convention, user:)
      create(:ticket, user_con_profile: other_profile)

      result = presenter.new_and_returning_attendees
      counts = result[:organization_attendance_counts]

      assert_equal 1, counts.length
      assert_equal profile, counts.first.current_convention_user_con_profile
      assert_equal 2, counts.first.attended_convention_ids.length
    end

    it "does not include attendees from other conventions in the current convention results" do
      other_profile = create(:user_con_profile, convention: other_convention)
      create(:ticket, user_con_profile: other_profile)

      result = presenter.new_and_returning_attendees

      assert_empty result[:organization_attendance_counts]
    end

    it "returns an empty list when the convention has no organization" do
      unaffiliated_convention = create(:convention, organization: nil, ticket_mode: "required_for_signup")
      profile = create(:user_con_profile, convention: unaffiliated_convention)
      create(:ticket, user_con_profile: profile)

      result = ConventionReportsPresenter.new(unaffiliated_convention).new_and_returning_attendees

      assert_empty result[:organization_attendance_counts]
    end
  end
end
