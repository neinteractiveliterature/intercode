require 'test_helper'

describe UserConProfilesController do
  let(:user_con_profile) { create :user_con_profile }
  let(:convention) { user_con_profile.convention }
  let(:con_admin_profile) { create :user_con_profile, convention: convention, staff: true }
  let(:con_admin) { con_admin_profile.user }

  setup do
    set_convention convention
    sign_in con_admin

    user_con_profile
  end

  test 'should get export' do
    get :export, format: :csv
    assert_response :success
  end
end
