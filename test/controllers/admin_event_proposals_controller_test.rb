require 'test_helper'

class AdminEventProposalsControllerTest < ActionDispatch::IntegrationTest
  let(:convention) { FactoryBot.create(:convention) }
  let(:user_con_profile) { FactoryBot.create(:staff_user_con_profile, convention: convention) }
  let(:user) { user_con_profile.user }
  let(:event_proposal) do
    FactoryBot.build(:event_proposal, convention: convention).tap do |proposal|
      proposal.assign_default_values_from_form_items(convention.event_proposal_form.form_items)
      proposal.save!
    end
  end

  before do
    ClearCmsContentService.new(convention: convention).call!
    LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!

    set_convention convention
    sign_in user
  end

  test 'should get index' do
    get admin_event_proposals_url
    assert_response :success
  end

  test 'should not allow viewing drafts' do
    draft = FactoryBot.create(:event_proposal, convention: convention, status: 'draft')
    get admin_event_proposal_url(draft)
    assert_redirected_to root_url
  end

  test 'should show admin_event_proposal' do
    get admin_event_proposal_url(event_proposal)
    assert_response :success
  end

  test 'should update admin_event_proposal' do
    patch admin_event_proposal_url(event_proposal), params: { event_proposal: { status: 'reviewing' } }
    assert_redirected_to admin_event_proposal_url(event_proposal)
  end

  test 'should create event on acceptance' do
    assert_difference 'Event.count', 1 do
      patch admin_event_proposal_url(event_proposal), params: { event_proposal: { status: 'accepted' } }
    end
  end
end
