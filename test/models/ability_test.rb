require 'test_helper'

class AbilityTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:ability) { Ability.new(user_con_profile.user, nil) }
  let(:event_category) { create(:event_category, convention: convention) }

  describe 'EventProposal' do
    let(:user_con_profile) { create(:staff_user_con_profile, convention: convention) }
    let(:event_proposal) do
      build(:event_proposal, convention: convention, event_category: event_category, status: 'proposed').tap do |proposal|
        proposal.assign_default_values_from_form_items(event_category.event_proposal_form.form_items)
        proposal.save!
      end
    end

    before do
      ClearCmsContentService.new(convention: convention).call!
      LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
      event_category.update!(event_proposal_form: convention.forms.find_by!(title: 'Proposal form'))
    end

    it 'should not allow viewing drafts' do
      draft = create(:event_proposal, convention: convention, status: 'draft')
      refute ability.can?(:read, draft)
    end

    it 'should allow viewing proposed proposals' do
      assert ability.can?(:read, event_proposal)
    end
  end
end
