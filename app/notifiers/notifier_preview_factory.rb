# frozen_string_literal: true
class NotifierPreviewFactory
  attr_reader :event_key, :convention

  def initialize(event_key:, convention:)
    @event_key = event_key
    @convention = convention
  end

  def notifier
    notifier_class.new(**parameters)
  end

  def notifier_class
    @notifier_class ||= Notifier::NOTIFIER_CLASSES_BY_EVENT_KEY.fetch(event_key)
  end

  def parameter_names
    @parameter_names ||= notifier_class.instance_method(:initialize).parameters.map(&:second)
  end

  def parameters
    @parameters ||= parameter_names.index_with { |parameter_name| parameter_value(parameter_name) }
  end

  # This is super not worth refactoring
  def synthesize_parameter_value(parameter_name) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    case parameter_name
    when :alert_user_con_profile
      UserConProfile.new(convention: convention)
    when :changes
      []
    when :event_proposal
      EventProposal.new(
        convention: convention,
        event_category: EventCategory.new(convention: convention, name: "Category Name"),
        title: "Proposal Title"
      )
    when :event
      if event_key == "user_activity_alerts/alert"
        "test_event"
      else
        Event.new(
          convention: convention,
          event_category: EventCategory.new(convention: convention, name: "Category Name"),
          title: "Event Title"
        )
      end
    when :order
      Order.new(user_con_profile: UserConProfile.new(convention: convention))
    when :signup
      Signup.new(run: Run.new(event: Event.new(convention: convention, title: "Event Title")))
    when :signup_request
      SignupRequest.new(target_run: Run.new(event: Event.new(convention: convention, title: "Event Title")))
    when :ticket
      Ticket.new(user_con_profile: UserConProfile.new(convention: convention))
    when :user_activity_alert
      UserActivityAlert.new(convention: convention)
    when :whodunit
      User.new
    end
  end

  # This is super not worth refactoring
  def find_parameter_value(parameter_name) # rubocop:disable Metrics
    case parameter_name
    when :alert_user_con_profile
      convention.user_con_profiles.first
    when :changes
      [
        convention.events.first&.form_response_changes&.first ||
          convention.event_proposals.first&.form_response_changes&.first
      ].compact
    when :event_proposal
      convention.event_proposals.first
    when :event
      event_key == "user_activity_alerts/alert" ? "test_event" : convention.events.first
    when :move_result
      find_signup_move_result
    when :move_results
      [find_signup_move_result]
    when :order
      Order.where(user_con_profile: convention.user_con_profiles.select(:id)).first
    when :prev_state
      "confirmed"
    when :prev_bucket_key
      "flex"
    when :refund_id
      "refund-abc123"
    when :signup
      convention.signups.first
    when :signup_request
      convention.signup_requests.first
    when :ticket
      convention.tickets.first
    when :user_activity_alert
      convention.user_activity_alerts.first
    when :whodunit
      User.first
    end
  end

  def parameter_value(parameter_name)
    find_parameter_value(parameter_name) || synthesize_parameter_value(parameter_name)
  end

  def find_signup_move_result
    SignupMoveResult.new(convention.signups.first.id, "confirmed", "flex", "waitlisted", nil)
  end
end
