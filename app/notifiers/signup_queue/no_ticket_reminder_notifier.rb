# frozen_string_literal: true
class SignupQueue::NoTicketReminderNotifier < Notifier
  attr_reader :signup_ranked_choice
  delegate :user_con_profile, to: :signup_ranked_choice

  dynamic_destination :signup_ranked_choice_user_con_profile do
    { signup_ranked_choice: }
  end

  def initialize(signup_ranked_choice:)
    @signup_ranked_choice = signup_ranked_choice
    super(convention: user_con_profile.convention, event_key: "signup_queue/no_ticket_reminder")
  end

  def initializer_options
    { signup_ranked_choice: }
  end

  def liquid_assigns
    super.merge(
      "user_con_profile" => user_con_profile,
      "ticket_name" => convention.ticket_name,
      "queue_items" => user_con_profile.signup_ranked_choices.where(state: "pending")
    )
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :signup_ranked_choice_user_con_profile)]
  end
end
