require 'test_helper'

class EventProposals::NewProposalNotifierTest < ActionMailer::TestCase
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event_category) { create(:event_category, convention: convention) }
  let(:proposal_chair) do
    create(:user_con_profile, convention: convention)
  end
  let(:proposer) do
    create(:user_con_profile, convention: convention)
  end
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

  describe '#destinations' do
    it 'notifies the proposal chair(s)' do
      event_proposal
      proposal_chair_staff_position
      notifier = EventProposals::NewProposalNotifier.new(event_proposal: event_proposal)
      assert_equal [proposal_chair_staff_position], notifier.destinations
    end

    it 'notifies staff users, if there is no proposal chair' do
      event_proposal
      pos = create(:staff_position, convention: convention)
      Permission.grant(pos, convention, 'read_event_proposals', 'read_pending_event_proposals')
      staffer = create(:user_con_profile, convention: convention)
      pos.user_con_profiles << staffer
      notifier = EventProposals::NewProposalNotifier.new(event_proposal: event_proposal)
      assert_equal [pos], notifier.destinations
    end
  end
end
