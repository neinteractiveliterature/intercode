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
    reminder_window_start = 1.week.from_now.beginning_of_day
    reminder_window_end = 1.week.from_now.end_of_day

    @signup_ranked_choices_to_remind ||=
      SignupRankedChoice
        .joins(:user_con_profile)
        .joins(user_con_profile: :convention)
        .joins("LEFT JOIN tickets ON tickets.user_con_profile_id = user_con_profiles.id")
        .joins(sanitize_sql_array([<<~SQL.squish, reminder_window_start, reminder_window_end]))
                INNER JOIN signup_rounds ON signup_rounds.convention_id = conventions.id
                AND signup_rounds.automation_action = 'execute_ranked_choice'
                AND signup_rounds.executed_at IS NULL
                AND signup_rounds.start BETWEEN ? AND ?
              SQL
        .where(state: "pending")
        .where(tickets: { id: nil })
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

  def sanitize_sql_array(array)
    SignupRankedChoice.sanitize_sql_array(array)
  end
end
