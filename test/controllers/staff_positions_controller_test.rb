require 'test_helper'

class StaffPositionsControllerTest < ActionDispatch::IntegrationTest
  let(:user_con_profile) { FactoryBot.create(:staff_user_con_profile) }
  let(:convention) { user_con_profile.convention }
  let(:staff_position) { FactoryBot.create(:staff_position, convention: convention) }

  setup do
    set_convention convention
    sign_in user_con_profile.user
  end

  test 'should get index' do
    get staff_positions_url
    assert_response :success
  end

  test 'should get new' do
    get new_staff_position_url
    assert_response :success
  end

  test 'should create staff_position' do
    assert_difference('StaffPosition.count') do
      post staff_positions_url, params: { staff_position: { name: 'Dogcatcher' } }
    end

    assert_redirected_to staff_positions_url
  end

  test 'should get edit' do
    get edit_staff_position_url(staff_position)
    assert_response :success
  end

  test 'should update staff_position' do
    patch staff_position_url(staff_position), params: { staff_position: { email: 'wrangler@testcon.example.com' } }
    assert_redirected_to staff_positions_url
  end

  test 'should destroy staff_position' do
    staff_position

    assert_difference('StaffPosition.count', -1) do
      delete staff_position_url(staff_position)
    end

    assert_redirected_to staff_positions_url
  end
end
