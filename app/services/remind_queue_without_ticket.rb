# frozen_string_literal: true
class RemindQueueWithoutTicket < CivilService::Service
  private

  def inner_call
    signup_ranked_choices_to_remind.each do |signup_ranked_choice|
      SignupQueue::NoTicketReminderNotifier.new(signup_ranked_choice: signup_ranked_choice).deliver_later
      signup_ranked_choice.user_con_profile.update_columns(queue_no_ticket_reminded_at: Time.zone.now)
    end

    success
  end

  def signup_ranked_choices_to_remind
    @signup_ranked_choices_to_remind ||=
      SignupRankedChoice
        .joins(:user_con_profile)
        .joins(user_con_profile: :convention)
        .joins("LEFT JOIN tickets ON tickets.user_con_profile_id = user_con_profiles.id")
        .where(state: "pending")
        .where(tickets: { id: nil })
        .where(conventions: { ticket_mode: %w[required_for_signup ticket_per_event] })
        .where("conventions.starts_at > ?", Time.zone.now)
        .where(
          "user_con_profiles.queue_no_ticket_reminded_at IS NULL OR user_con_profiles.queue_no_ticket_reminded_at < ?",
          1.week.ago
        )
        .select("DISTINCT ON (user_con_profiles.id) signup_ranked_choices.*")
        .includes(user_con_profile: :convention)
  end
end
