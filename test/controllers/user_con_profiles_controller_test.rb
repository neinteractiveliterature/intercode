require 'test_helper'

describe UserConProfilesController do
  let(:user_con_profile) { create :user_con_profile }
  let(:convention) { user_con_profile.convention }
  let(:con_admin_staff_position) { create(:admin_staff_position, convention: convention) }
  let(:con_admin_profile) do
    profile = create(:user_con_profile, convention: convention)
    con_admin_staff_position.user_con_profiles << profile
    profile
  end
  let(:con_admin) { con_admin_profile.user }

  setup do
    set_convention convention
    sign_in con_admin

    user_con_profile
  end

  # TODO write tests for become/revert_become
end
