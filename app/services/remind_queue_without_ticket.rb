# frozen_string_literal: true
class RemindQueueWithoutTicket < CivilService::Service
  private

  def inner_call
    users_to_remind.each do |user_con_profile|
      SignupQueue::NoTicketReminderNotifier.new(user_con_profile: user_con_profile).deliver_later
      user_con_profile.update_columns(queue_no_ticket_reminded_at: Time.zone.now)
    end

    success
  end

  def users_to_remind
    @users_to_remind ||=
      UserConProfile
        .joins(:convention, :signup_ranked_choices)
        .joins("LEFT JOIN tickets ON tickets.user_con_profile_id = user_con_profiles.id")
        .where(tickets: { id: nil })
        .where(conventions: { ticket_mode: %w[required_for_signup ticket_per_event] })
        .where("conventions.starts_at > ?", Time.zone.now)
        .where(
          "user_con_profiles.queue_no_ticket_reminded_at IS NULL OR user_con_profiles.queue_no_ticket_reminded_at < ?",
          1.week.ago
        )
        .distinct
        .includes(:convention, :signup_ranked_choices)
  end
end
