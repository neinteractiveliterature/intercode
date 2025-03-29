require "test_helper"

class EventProposals::NewProposalNotifierTest < ActionMailer::TestCase
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event_category) { create(:event_category, convention: convention) }
  let(:proposal_chair) { create(:user_con_profile, convention: convention) }
  let(:proposer) { create(:user_con_profile, convention: convention) }
  let(:proposal_chair_staff_position) do
    create(:staff_position, convention:, user_con_profiles: [proposal_chair]).tap do |sp|
      %w[read_event_proposals read_pending_event_proposals].each do |permission|
        sp.permissions.create!(model: event_category, permission: permission)
      end
    end
  end
  let(:global_chair_staff_position) do
    create(:staff_position, convention:).tap do |sp|
      %w[read_event_proposals read_pending_event_proposals].each do |permission|
        sp.permissions.create!(model: convention, permission: permission)
      end
    end
  end
  let(:event_proposal) do
    create(:event_proposal, convention: convention, event_category: event_category, owner: proposer)
  end

  describe ".build_default_destinations" do
    it "notifies the category-specific proposal chair(s) if there are any, as well as the global proposal chair(s)" do
      event_proposal
      proposal_chair_staff_position
      global_chair_staff_position

      notification_template = convention.notification_templates.find_by!(event_key: "event_proposals/new_proposal")
      destinations = EventProposals::NewProposalNotifier.build_default_destinations(notification_template:)

      assert_equal 2, destinations.size
      category_specific_destination = destinations.find { |d| d.staff_position == proposal_chair_staff_position }
      global_destination = destinations.find { |d| d.staff_position == global_chair_staff_position }
      assert(category_specific_destination, "Expected a destination for the category-specific proposal chair")
      assert_equal(
        { "event_category" => event_category.id },
        category_specific_destination.conditions,
        "Expected the category-specific proposal chair destination to be conditional on the category ID"
      )
      assert(global_destination, "Expected a destination for the global proposal chair")
      assert(global_destination.conditions.blank?, "Expected no conditions on the global proposal chair destination")
    end
  end
end
