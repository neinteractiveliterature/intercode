# frozen_string_literal: true
require "test_helper"

class DropExpiredSignupsJobTest < ActiveJob::TestCase
  let(:convention) { create(:convention, ticket_mode: "ticket_per_event") }
  let(:event) { create(:event, convention:) }
  let(:signup_run) { create(:run, event:, starts_at: 2.days.from_now) }

  def hold(expires_at:)
    create(
      :signup,
      state: "ticket_purchase_hold",
      counted: true,
      expires_at:,
      run: signup_run,
      user_con_profile: create(:user_con_profile, convention:)
    )
  end

  it "withdraws holds that have expired" do
    expired = hold(expires_at: 5.minutes.ago)

    DropExpiredSignupsJob.perform_now

    assert_equal "withdrawn", expired.reload.state
  end

  it "leaves holds that haven't expired" do
    unexpired = hold(expires_at: 20.minutes.from_now)

    DropExpiredSignupsJob.perform_now

    assert_equal "ticket_purchase_hold", unexpired.reload.state
  end

  it "doesn't withdraw a hold that was bought after the job loaded it" do
    stale = Signup.find(hold(expires_at: 5.minutes.ago).id)
    Signup.find(stale.id).update!(state: "confirmed", expires_at: nil)

    DropExpiredSignupsJob.new.send(:withdraw_if_still_expired, stale)

    assert_equal "confirmed", Signup.find(stale.id).state
  end

  it "doesn't withdraw the same hold twice when a stale copy is processed again" do
    expired = hold(expires_at: 5.minutes.ago)
    stale_copy = Signup.find(expired.id)
    job = DropExpiredSignupsJob.new

    assert_difference -> { SignupChange.count }, 1 do
      job.send(:withdraw_if_still_expired, expired)
      job.send(:withdraw_if_still_expired, stale_copy)
    end
  end
end
