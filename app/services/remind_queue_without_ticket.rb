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

  # rubocop:disable Metrics/MethodLength
  def signup_ranked_choices_to_remind
    @signup_ranked_choices_to_remind ||=
      SignupRankedChoice
        .joins(:user_con_profile)
        .joins(user_con_profile: :convention)
        .joins("LEFT JOIN tickets ON tickets.user_con_profile_id = user_con_profiles.id")
        .joins("INNER JOIN signup_rounds ON signup_rounds.convention_id = conventions.id")
        .where(state: "pending")
        .where(tickets: { id: nil })
        .where(signup_rounds: { automation_action: "execute_ranked_choice", executed_at: nil })
        .where.not(conventions: { queue_no_ticket_reminder_advance_seconds: nil })
        .where(
          "DATE_TRUNC('day', signup_rounds.start AT TIME ZONE 'UTC') = " \
            "DATE_TRUNC('day', " \
            "(NOW() + (conventions.queue_no_ticket_reminder_advance_seconds * INTERVAL '1 second')) " \
            "AT TIME ZONE 'UTC')"
        )
        .where(
          conventions: {
            ticket_mode: %w[required_for_signup ticket_per_event],
            signup_automation_mode: "ranked_choice"
          }
        )
        .where(user_con_profiles: { queue_no_ticket_reminded_at: nil })
        .select("DISTINCT ON (user_con_profiles.id) signup_ranked_choices.*")
        .includes(user_con_profile: :convention)
  end
  # rubocop:enable Metrics/MethodLength
end
