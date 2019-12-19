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
    @parameters ||= parameter_names.map do |parameter_name|
      [parameter_name, parameter_value(parameter_name)]
    end.to_h
  end

  def synthesize_parameter_value(parameter_name)
    case parameter_name
    when :alert_user_con_profile then UserConProfile.new(convention: convention)
    when :changes then []
    when :event_proposal
      EventProposal.new(
        convention: convention, event_category: EventCategory.new(convention: convention)
      )
    when :event
      if event_key == 'user_activity_alerts/alert'
        'test_event'
      else
        Event.new(convention: convention, event_category: EventCategory.new(convention: convention))
      end
    when :order then Order.new(user_con_profile: UserConProfile.new(convention: convention))
    when :signup then Signup.new(run: Run.new(event: Event.new(convention: convention)))
    when :signup_request
      SignupRequest.new(target_run: Run.new(event: Event.new(convention: convention)))
    when :user_activity_alert then UserActivityAlert.new(convention: convention)
    when :whodunit then User.new
    end
  end

  def find_parameter_value(parameter_name)
    case parameter_name
    when :alert_user_con_profile then convention.user_con_profiles.first
    when :changes
      [
        convention.events.first&.form_response_changes&.first ||
          convention.event_proposals.first&.form_response_changes&.first
      ]
    when :event_proposal then convention.event_proposals.first
    when :event
      if event_key == 'user_activity_alerts/alert'
        'test_event'
      else
        convention.events.first
      end
    when :move_result then find_signup_move_result
    when :move_results then [find_signup_move_result]
    when :order then Order.where(user_con_profile: convention.user_con_profiles.select(:id)).first
    when :prev_state then 'confirmed'
    when :prev_bucket_key then 'flex'
    when :refund_id then 'refund-abc123'
    when :signup then convention.signups.first
    when :signup_request then convention.signup_requests.first
    when :user_activity_alert then convention.user_activity_alerts.first
    when :whodunit then User.first
    end
  end

  def parameter_value(parameter_name)
    find_parameter_value(parameter_name) || synthesize_parameter_value(parameter_name)
  end

  def find_signup_move_result
    SignupMoveResult.new(convention.signups.first.id, 'confirmed', 'flex', 'waitlisted', nil)
  end
end
