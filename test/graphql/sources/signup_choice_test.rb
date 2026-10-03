# frozen_string_literal: true
require "test_helper"

describe Sources::SignupChoice do
  let(:convention) { create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }

  def counted_signup(profile, created_at:)
    create(:signup, user_con_profile: profile, run: create(:run, event: create(:event, convention:)), created_at:)
  end

  it "numbers a user's counted signups by creation time, starting at 1" do
    second = counted_signup(user_con_profile, created_at: 2.hours.ago)
    first = counted_signup(user_con_profile, created_at: 3.hours.ago)
    third = counted_signup(user_con_profile, created_at: 1.hour.ago)

    assert_equal [1, 2, 3], Sources::SignupChoice.new.fetch([first, second, third])
    assert_equal [3, 2], Sources::SignupChoice.new.fetch([third, second])
  end

  it "returns nil for signups that aren't counted" do
    counted = counted_signup(user_con_profile, created_at: 2.hours.ago)
    uncounted =
      create(
        :signup,
        user_con_profile:,
        run: create(:run, event: create(:event, convention:)),
        state: "waitlisted",
        counted: false,
        created_at: 1.hour.ago
      )

    assert_equal [1, nil], Sources::SignupChoice.new.fetch([counted, uncounted])
  end

  it "numbers each user's signups independently" do
    other_profile = create(:user_con_profile, convention:)
    mine = counted_signup(user_con_profile, created_at: 2.hours.ago)
    mine_later = counted_signup(user_con_profile, created_at: 1.hour.ago)
    theirs = counted_signup(other_profile, created_at: 1.hour.ago)

    assert_equal [1, 2, 1], Sources::SignupChoice.new.fetch([mine, mine_later, theirs])
  end
end
