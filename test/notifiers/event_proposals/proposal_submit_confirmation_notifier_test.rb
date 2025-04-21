require "test_helper"

class EventProposals::NewProposalNotifierTest < ActionMailer::TestCase
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event_category) { create(:event_category, convention: convention) }
  let(:proposal_chair) { create(:user_con_profile, convention: convention) }
  let(:proposer) { create(:user_con_profile, convention: convention) }
  let(:proposal_chair_staff_position) do
    create(:staff_position, convention: convention, user_con_profiles: [proposal_chair]).tap do |sp|
      %w[read_event_proposals read_pending_event_proposals].each do |permission|
        sp.permissions.create!(model: event_category, permission: permission)
      end
    end
  end
  let(:event_proposal) do
    create(:event_proposal, convention: convention, event_category: event_category, owner: proposer)
  end

  describe ".build_default_destinations" do
    it "notifies the proposal owner" do
      event_proposal
      proposal_chair_staff_position
      proposal_chair_staff_position.update!(email: "proposal-chair@example.com")

      notification_template =
        convention.notification_templates.find_by!(event_key: "event_proposals/proposal_submit_confirmation")
      destinations =
        EventProposals::ProposalSubmitConfirmationNotifier.build_default_destinations(notification_template:)

      assert_equal 1, destinations.size
      assert_equal "event_proposal_owner", destinations.first.dynamic_destination
    end
  end
end
