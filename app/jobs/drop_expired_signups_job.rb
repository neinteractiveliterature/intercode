# frozen_string_literal: true
class DropExpiredSignupsJob < ApplicationJob
  include SkipIfAlreadyRunning

  def perform
    Signup
      .joins(:convention)
      .where(conventions: { ticket_mode: "ticket_per_event" })
      .where(state: "ticket_purchase_hold")
      .where(expires_at: ...expiry_cutoff)
      .find_each { |signup| withdraw_if_still_expired(signup) }
  end

  private

  def expiry_cutoff
    1.minute.ago
  end

  # The signup was loaded a while ago (possibly many signups ago), so under the run's lock, check that it's still an
  # expired hold before withdrawing it: someone may have bought their ticket in the meantime
  def withdraw_if_still_expired(signup)
    withdrawn = false

    ActiveRecord::Base.with_advisory_lock("run_#{signup.run_id}_signups", transaction: true) do
      signup.reload
      next unless signup.ticket_purchase_hold? && signup.expires_at && signup.expires_at < expiry_cutoff

      EventWithdrawService.new(signup, nil, skip_locking: true, action: "hold_expired").call!
      withdrawn = true
    end

    Signups::HoldExpiredNotifier.new(signup:).deliver_later(wait: 5.seconds) if withdrawn
  end
end
