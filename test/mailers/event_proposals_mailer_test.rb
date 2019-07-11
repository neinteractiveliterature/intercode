require 'test_helper'

class EventProposalsMailerTest < ActionMailer::TestCase
  let(:event_category) { create(:event_category) }
  let(:convention) { event_category.convention }
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

  describe '#new_proposal' do
    it 'sends email to the proposal chair(s)' do
      event_proposal
      proposal_chair_staff_position
      email = EventProposalsMailer.new_proposal(event_proposal)
      assert_emails 1 do
        email.deliver_now
      end
      assert_equal [proposal_chair.email], email.to
    end

    it 'sends email to the proposal chair email address, if it exists' do
      event_proposal
      proposal_chair_staff_position
      proposal_chair_staff_position.update!(email: 'proposal-chair@example.com')
      email = EventProposalsMailer.new_proposal(event_proposal)
      assert_emails 1 do
        email.deliver_now
      end
      assert_equal [proposal_chair_staff_position.email], email.to
    end

    it 'sends email to staff users, if there is no proposal chair' do
      event_proposal
      staffer = create(:user_con_profile, convention: convention, staff: true)
      email = EventProposalsMailer.new_proposal(event_proposal)
      assert_emails 1 do
        email.deliver_now
      end
      assert_equal [staffer.email], email.to
    end
  end

  describe '#proposal_submit_confirmation' do
    it 'sends email to the proposal owner' do
      event_proposal
      proposal_chair_staff_position
      proposal_chair_staff_position.update!(email: 'proposal-chair@example.com')
      email = EventProposalsMailer.proposal_submit_confirmation(event_proposal)

      assert_emails 1 do
        email.deliver_now
      end

      assert_equal [proposal_chair_staff_position.email], email.from
      assert_equal [event_proposal.owner.email], email.to
    end
  end
end
