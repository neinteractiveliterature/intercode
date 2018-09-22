require 'test_helper'

class AcceptEventProposalServiceTest < ActiveSupport::TestCase
  let(:event_proposal) do
    FactoryBot.build(:event_proposal).tap do |proposal|
      proposal.assign_default_values_from_form_items(
        proposal.convention.event_proposal_form.form_items
      )
      proposal.save!
    end
  end

  it 'creates an event' do
    assert_difference 'Event.count', 1 do
      AcceptEventProposalService.new(event_proposal: event_proposal).call!
    end
  end
end
