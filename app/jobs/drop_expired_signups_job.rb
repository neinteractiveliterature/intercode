# frozen_string_literal: true
class DropExpiredSignupsJob < ApplicationJob
  def perform
    Signup
      .occupying_slot
      .where('expires_at < ?', 1.minute.ago)
      .find_each do
        EventWithdrawService.new(signup, nil, action: 'hold_expired').call!
        Signups::HoldExpiredNotifier.new(signup: signup).deliver_later(wait: 5.seconds)
      end
  end
end
