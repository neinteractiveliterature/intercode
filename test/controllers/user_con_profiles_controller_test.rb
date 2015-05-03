require 'test_helper'

class UserConProfilesControllerTest < ActionController::TestCase
  setup do
    @user_con_profile = user_con_profiles(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_con_profiles)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_con_profile" do
    assert_difference('UserConProfile.count') do
      post :create, user_con_profile: {  }
    end

    assert_redirected_to user_con_profile_path(assigns(:user_con_profile))
  end

  test "should show user_con_profile" do
    get :show, id: @user_con_profile
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_con_profile
    assert_response :success
  end

  test "should update user_con_profile" do
    patch :update, id: @user_con_profile, user_con_profile: {  }
    assert_redirected_to user_con_profile_path(assigns(:user_con_profile))
  end

  test "should destroy user_con_profile" do
    assert_difference('UserConProfile.count', -1) do
      delete :destroy, id: @user_con_profile
    end

    assert_redirected_to user_con_profiles_path
  end
end
