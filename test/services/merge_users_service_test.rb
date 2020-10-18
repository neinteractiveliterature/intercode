require 'test_helper'

class MergeUsersServiceTest < ActiveSupport::TestCase
  it 'merges two users' do
    profile1, profile2 = create_list(:user_con_profile, 2)
    user_id1, user_id2 = [profile1, profile2].map(&:user_id)

    MergeUsersService.new(
      user_ids: [user_id1, user_id2],
      winning_user_id: user_id1,
      winning_user_con_profile_ids_by_convention_id: {}
    ).call!

    assert UserConProfile.find_by(id: profile1.id)
    assert User.find_by(id: user_id1)
    assert UserConProfile.find_by(id: profile2.id)
    assert_equal user_id1, UserConProfile.find_by(id: profile2.id).user_id
    assert_nil User.find_by(id: user_id2)
  end

  it 'merges two profiles from the same convention' do
    profile1, profile2 = create_list(:user_con_profile, 2)
    user_id1, user_id2 = [profile1, profile2].map(&:user_id)
    profile3 = create(:user_con_profile, convention: profile1.convention, user: profile2.user)

    MergeUsersService.new(
      user_ids: [user_id1, user_id2],
      winning_user_id: user_id1,
      winning_user_con_profile_ids_by_convention_id: {
        profile3.convention_id => profile3.id
      }
    ).call!

    assert_nil UserConProfile.find_by(id: profile1.id)
    assert User.find_by(id: user_id1)
    assert UserConProfile.find_by(id: profile2.id)
    assert UserConProfile.find_by(id: profile3.id)
    assert_equal user_id1, UserConProfile.find_by(id: profile2.id).user_id
    assert_nil User.find_by(id: user_id2)
  end
end
