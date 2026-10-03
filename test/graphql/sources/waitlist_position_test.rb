# frozen_string_literal: true
require "test_helper"

describe Sources::WaitlistPosition do
  let(:convention) { create(:convention) }
  let(:event) { create(:event, convention:) }
  let(:the_run) { create(:run, event:) }

  def waitlist_signup(run, created_at:)
    create(:signup, run:, state: "waitlisted", counted: false, created_at:)
  end

  it "numbers waitlisted signups by creation time, starting at 1" do
    second = waitlist_signup(the_run, created_at: 2.hours.ago)
    first = waitlist_signup(the_run, created_at: 3.hours.ago)
    third = waitlist_signup(the_run, created_at: 1.hour.ago)

    assert_equal [1, 2, 3], Sources::WaitlistPosition.new.fetch([first, second, third])
    assert_equal [3, 1], Sources::WaitlistPosition.new.fetch([third, first])
  end

  it "ignores confirmed and withdrawn signups when numbering" do
    create(:signup, run: the_run, created_at: 5.hours.ago)
    create(:signup, run: the_run, state: "withdrawn", counted: false, created_at: 4.hours.ago)
    waitlisted = waitlist_signup(the_run, created_at: 1.hour.ago)

    assert_equal [1], Sources::WaitlistPosition.new.fetch([waitlisted])
  end

  it "returns nil for signups that are not waitlisted" do
    waitlist_signup(the_run, created_at: 1.hour.ago)
    confirmed = create(:signup, run: the_run)

    assert_equal [nil], Sources::WaitlistPosition.new.fetch([confirmed])
  end

  it "numbers each run's waitlist independently" do
    other_run = create(:run, event:)
    a2 = waitlist_signup(the_run, created_at: 1.hour.ago)
    a1 = waitlist_signup(the_run, created_at: 2.hours.ago)
    b1 = waitlist_signup(other_run, created_at: 1.hour.ago)

    assert_equal [2, 1, 1], Sources::WaitlistPosition.new.fetch([a2, a1, b1])
  end

  it "works through the GraphQL dataloader" do
    first = waitlist_signup(the_run, created_at: 2.hours.ago)
    second = waitlist_signup(the_run, created_at: 1.hour.ago)

    positions =
      GraphQL::Dataloader.with_dataloading do |dataloader|
        [first, second].map { |signup| dataloader.with(Sources::WaitlistPosition).request(signup) }.map(&:load)
      end

    assert_equal [1, 2], positions
  end
end
