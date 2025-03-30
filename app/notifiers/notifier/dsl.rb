module Notifier::Dsl
  extend ActiveSupport::Concern

  DYNAMIC_DESTINATION_EVALUATORS = {
    event_proposal_owner: Notifier::DynamicDestinations::EventProposalOwnerEvaluator,
    event_team_members: Notifier::DynamicDestinations::EventTeamMembersEvaluator,
    order_user_con_profile: Notifier::DynamicDestinations::OrderUserConProfileEvaluator,
    signup_request_user_con_profile: Notifier::DynamicDestinations::SignupRequestUserConProfileEvaluator,
    signup_user_con_profile: Notifier::DynamicDestinations::SignupUserConProfileEvaluator,
    ticket_user_con_profile: Notifier::DynamicDestinations::TicketUserConProfileEvaluator,
    triggering_user: Notifier::DynamicDestinations::TriggeringUserEvaluator,
    user_activity_alert_destinations: Notifier::DynamicDestinations::UserActivityAlertDestinationsEvaluator
  }

  CONDITION_EVALUATORS = { event_category: Notifier::Conditions::EventCategoryEvaluator }

  class_methods do
    def dynamic_destination(dynamic_destination, &block)
      @dynamic_destination_evaluators ||= {}
      @dynamic_destination_evaluators[dynamic_destination] = block || ->(*) { {} }
    end

    def evaluator_for_dynamic_destination(dynamic_destination, notifier)
      factory = @dynamic_destination_evaluators.fetch(dynamic_destination)
      args = notifier.instance_eval(&factory)
      evaluator_class = DYNAMIC_DESTINATION_EVALUATORS.fetch(dynamic_destination)
      evaluator_class.new(notifier: notifier, **args)
    end

    def condition(condition, &block)
      @condition_evaluators ||= {}
      @condition_evaluators[condition] = block || ->(*) { {} }
    end

    def evaluator_for_condition(condition, notifier)
      factory = @condition_evaluators.fetch(condition)
      args = notifier.instance_eval(&factory)
      evaluator_class = CONDITION_EVALUATORS.fetch(dynamic_destination)
      evaluator_class.new(notifier: notifier, **args)
    end

    def allowed_dynamic_destinations
      (@dynamic_destination_evaluators || {}).keys
    end

    def allowed_conditions
      (@condition_evaluators || {}).keys
    end
  end

  def dynamic_destination_evaluators
    self.class.allowed_dynamic_destinations.index_with do |dynamic_destination|
      self.class.evaluator_for_dynamic_destination(dynamic_destination, self)
    end
  end

  def evaluate_dynamic_destination(dynamic_destination)
    @dynamic_destination_evaluators ||= dynamic_destination_evaluators
    @dynamic_destination_evaluators.fetch(dynamic_destination.to_sym).user_con_profiles
  end

  def condition_evaluators
    self.class.allowed_conditions.index_with { |condition| self.class.evaluator_for_condition(condition, self) }
  end

  def evaluate_condition(condition_type, condition_value)
    @condition_evaluators ||= condition_evaluators
    @condition_evaluators.fetch(condition_type.to_sym).matches?(condition_value)
  end
end
