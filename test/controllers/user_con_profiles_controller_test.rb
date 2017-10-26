require 'test_helper'

describe UserConProfilesController do
  let(:user_con_profile) { FactoryBot.create :user_con_profile }
  let(:convention) { user_con_profile.convention }
  let(:con_admin_profile) { FactoryBot.create :user_con_profile, convention: convention, staff: true }
  let(:con_admin) { con_admin_profile.user }

  setup do
    set_convention convention
    sign_in con_admin

    user_con_profile
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_con_profiles_grid)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_con_profile" do
    user = FactoryBot.create(:user)

    assert_difference('UserConProfile.count') do
      post :create, params: { subject_profile: { email: user.email } }
    end

    assert_redirected_to user_con_profile_path(assigns(:subject_profile))
  end

  test "should show user_con_profile" do
    get :show, params: { id: user_con_profile }
    assert_response :success
  end

  test "should get edit" do
    get :edit, params: { id: user_con_profile }
    assert_response :success
  end

  test "should update user_con_profile" do
    user_con_profile.staff.must_equal false

    patch :update, params: { id: user_con_profile, subject_profile: { staff: true } }
    user_con_profile.reload.staff.must_equal true

    assert_redirected_to user_con_profile_path(assigns(:subject_profile))
  end

  test "should destroy user_con_profile" do
    assert_difference('UserConProfile.count', -1) do
      delete :destroy, params: { id: user_con_profile }
    end

    assert_redirected_to user_con_profiles_path
  end
end
