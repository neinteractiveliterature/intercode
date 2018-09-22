require 'test_helper'

class AdminEventProposalsControllerTest < ActionDispatch::IntegrationTest
  let(:user_con_profile) { FactoryBot.create(:staff_user_con_profile) }

  before do
    set_convention user_con_profile.convention
    sign_in user_con_profile.user
  end

  test 'should get index' do
    get admin_event_proposals_url
    assert_response :success
  end
end
