require "test_helper"

class MergeUsersServiceTest < ActiveSupport::TestCase
  it "merges two users" do
    profile1, profile2 = create_list(:user_con_profile, 2)
    user_id1, user_id2 = [profile1, profile2].map(&:user_id)

    MergeUsersService.new(
      user_ids: [user_id1, user_id2],
      winning_user_id: user_id1,
      winning_user_con_profile_ids_by_convention_id: {
      }
    ).call!

    assert UserConProfile.find_by(id: profile1.id)
    assert User.find_by(id: user_id1)
    assert UserConProfile.find_by(id: profile2.id)
    assert_equal user_id1, UserConProfile.find_by(id: profile2.id).user_id
    assert_nil User.find_by(id: user_id2)
  end

  it "reassigns signup_ranked_choices updated_by to winning user" do
    profile1, profile2 = create_list(:user_con_profile, 2)
    user1 = profile1.user
    user2 = profile2.user
    run = create(:run, event: create(:event, convention: profile2.convention))
    choice = create(:signup_ranked_choice, user_con_profile: profile2, target_run: run, updated_by: user2)

    MergeUsersService.new(
      user_ids: [user1.id, user2.id],
      winning_user_id: user1.id,
      winning_user_con_profile_ids_by_convention_id: {
      }
    ).call!

    assert_equal user1.id, choice.reload.updated_by_id
    assert_nil User.find_by(id: user2.id)
  end

  it "transfers signup_ranked_choices from losing profile to winning profile" do
    profile1, profile2 = create_list(:user_con_profile, 2)
    user_id1, user_id2 = [profile1, profile2].map(&:user_id)
    profile3 = create(:user_con_profile, convention: profile1.convention, user: profile2.user)

    # profile1 is the losing profile for the shared convention
    # profile3 is the winning profile for the shared convention
    run1 = create(:run, event: create(:event, convention: profile1.convention))
    run2 = create(:run, event: create(:event, convention: profile1.convention))
    choice1 = create(:signup_ranked_choice, user_con_profile: profile1, target_run: run1, updated_by: profile1.user)
    choice2 = create(:signup_ranked_choice, user_con_profile: profile1, target_run: run2, updated_by: profile1.user)

    MergeUsersService.new(
      user_ids: [user_id1, user_id2],
      winning_user_id: user_id1,
      winning_user_con_profile_ids_by_convention_id: {
        profile3.convention_id => profile3.id
      }
    ).call!

    assert_equal profile3.id, choice1.reload.user_con_profile_id
    assert_equal profile3.id, choice2.reload.user_con_profile_id
    assert_equal [1, 2], [choice1.reload.priority, choice2.reload.priority].sort
  end

  it "transfers signup_ranked_choices when both profiles have choices" do
    profile1, profile2 = create_list(:user_con_profile, 2)
    user_id1, user_id2 = [profile1, profile2].map(&:user_id)
    profile3 = create(:user_con_profile, convention: profile1.convention, user: profile2.user)

    run1 = create(:run, event: create(:event, convention: profile1.convention))
    run2 = create(:run, event: create(:event, convention: profile1.convention))
    run3 = create(:run, event: create(:event, convention: profile1.convention))

    # losing profile has priorities 1, 2; winning profile already has priority 1
    winning_choice =
      create(:signup_ranked_choice, user_con_profile: profile3, target_run: run3, updated_by: profile3.user)
    losing_choice1 =
      create(:signup_ranked_choice, user_con_profile: profile1, target_run: run1, updated_by: profile1.user)
    losing_choice2 =
      create(:signup_ranked_choice, user_con_profile: profile1, target_run: run2, updated_by: profile1.user)

    MergeUsersService.new(
      user_ids: [user_id1, user_id2],
      winning_user_id: user_id1,
      winning_user_con_profile_ids_by_convention_id: {
        profile3.convention_id => profile3.id
      }
    ).call!

    all_choices = SignupRankedChoice.where(user_con_profile: profile3).order(:priority)
    assert_equal 3, all_choices.count
    assert_equal [1, 2, 3], all_choices.map(&:priority)
    assert_includes all_choices, winning_choice.reload
    assert_includes all_choices, losing_choice1.reload
    assert_includes all_choices, losing_choice2.reload
  end

  it "merges two profiles from the same convention" do
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
