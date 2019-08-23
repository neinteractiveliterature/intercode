require 'test_helper'

class AdminEventProposalsControllerTest < ActionDispatch::IntegrationTest
  let(:admin_staff_position) { create(:admin_staff_position) }
  let(:user_con_profile) do
    profile = create(:user_con_profile, convention: admin_staff_position.convention)
    admin_staff_position.user_con_profiles << profile
    profile
  end

  before do
    set_convention user_con_profile.convention
    sign_in user_con_profile.user
  end

  test 'should get export' do
    get export_admin_event_proposals_url(format: 'csv')
    assert_response :success
  end
end
