require 'test_helper'

class AbilityTest < ActiveSupport::TestCase
  let(:convention) { FactoryBot.create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:ability) { Ability.new(user_con_profile.user, nil) }

  describe 'EventProposal' do
    let(:user_con_profile) { FactoryBot.create(:staff_user_con_profile, convention: convention) }
    let(:event_proposal) do
      FactoryBot.build(:event_proposal, convention: convention, status: 'proposed').tap do |proposal|
        proposal.assign_default_values_from_form_items(convention.event_proposal_form.form_items)
        proposal.save!
      end
    end

    before do
      ClearCmsContentService.new(convention: convention).call!
      LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
    end

    it 'should not allow viewing drafts' do
      draft = FactoryBot.create(:event_proposal, convention: convention, status: 'draft')
      refute ability.can?(:read, draft)
    end

    it 'should allow viewing proposed proposals' do
      assert ability.can?(:read, event_proposal)
    end
  end
end
