require "test_helper"

class ConventionReportsPresenterTest < ActiveSupport::TestCase
  let(:organization) { create(:organization) }
  let(:convention) { create(:convention, organization:, ticket_mode: "required_for_signup") }
  let(:other_convention) { create(:convention, organization:, ticket_mode: "required_for_signup") }
  let(:presenter) { ConventionReportsPresenter.new(convention) }

  describe "#new_and_returning_attendees" do
    it "returns new attendees who only have a ticket at this convention" do
      profile = create(:user_con_profile, convention:)
      create(:ticket, user_con_profile: profile)

      result = presenter.new_and_returning_attendees

      assert_includes result[:new_attendees], profile
      assert_empty result[:returning_attendees]
    end

    it "returns returning attendees who also have a ticket at another org convention" do
      user = create(:user)
      profile = create(:user_con_profile, convention:, user:)
      create(:ticket, user_con_profile: profile)

      other_profile = create(:user_con_profile, convention: other_convention, user:)
      create(:ticket, user_con_profile: other_profile)

      result = presenter.new_and_returning_attendees

      assert_empty result[:new_attendees]
      assert_includes result[:returning_attendees], profile
    end

    it "does not include attendees from other conventions in the current convention results" do
      other_profile = create(:user_con_profile, convention: other_convention)
      create(:ticket, user_con_profile: other_profile)

      result = presenter.new_and_returning_attendees

      assert_empty result[:new_attendees]
      assert_empty result[:returning_attendees]
    end

    it "returns all attendees as new when the convention has no organization" do
      unaffiliated_convention = create(:convention, organization: nil, ticket_mode: "required_for_signup")
      profile = create(:user_con_profile, convention: unaffiliated_convention)
      create(:ticket, user_con_profile: profile)

      result = ConventionReportsPresenter.new(unaffiliated_convention).new_and_returning_attendees

      assert_includes result[:new_attendees], profile
      assert_empty result[:returning_attendees]
    end
  end
end
