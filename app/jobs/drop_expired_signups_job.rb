# frozen_string_literal: true
class DropExpiredSignupsJob < ApplicationJob
  def perform
    Signup
      .joins(:convention)
      .where(conventions: { ticket_mode: "ticket_per_event" })
      .where(state: "ticket_purchase_hold")
      .where(expires_at: ...1.minute.ago)
      .find_each do |signup|
        EventWithdrawService.new(signup, nil, action: "hold_expired").call!
        Signups::HoldExpiredNotifier.new(signup:).deliver_later(wait: 5.seconds)
      end
  end
end
