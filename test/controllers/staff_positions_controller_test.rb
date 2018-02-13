require 'test_helper'

class StaffPositionsControllerTest < ActionDispatch::IntegrationTest
  let(:user_con_profile) { FactoryBot.create(:staff_user_con_profile) }
  let(:convention) { user_con_profile.convention }

  setup do
    set_convention convention
    sign_in user_con_profile.user
  end

  test 'should get index' do
    get staff_positions_url
    assert_response :success
  end
end
