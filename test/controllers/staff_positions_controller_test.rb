require 'test_helper'

class StaffPositionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @staff_position = staff_positions(:one)
  end

  test "should get index" do
    get staff_positions_url
    assert_response :success
  end

  test "should get new" do
    get new_staff_position_url
    assert_response :success
  end

  test "should create staff_position" do
    assert_difference('StaffPosition.count') do
      post staff_positions_url, params: { staff_position: {  } }
    end

    assert_redirected_to staff_position_url(StaffPosition.last)
  end

  test "should show staff_position" do
    get staff_position_url(@staff_position)
    assert_response :success
  end

  test "should get edit" do
    get edit_staff_position_url(@staff_position)
    assert_response :success
  end

  test "should update staff_position" do
    patch staff_position_url(@staff_position), params: { staff_position: {  } }
    assert_redirected_to staff_position_url(@staff_position)
  end

  test "should destroy staff_position" do
    assert_difference('StaffPosition.count', -1) do
      delete staff_position_url(@staff_position)
    end

    assert_redirected_to staff_positions_url
  end
end
