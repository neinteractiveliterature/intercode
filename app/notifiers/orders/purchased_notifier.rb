# frozen_string_literal: true
class Orders::PurchasedNotifier < Notifier
  attr_reader :order

  def initialize(order:)
    @order = order
    super(convention: order.user_con_profile.convention, event_key: "orders/purchased")
  end

  def liquid_assigns
    super.merge("order" => order)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :order_user_con_profile)]
  end

  def self.allowed_dynamic_destinations
    %i[order_user_con_profile triggering_user]
  end

  def dynamic_destination_evaluators
    {
      order_user_con_profile: Notifier::DynamicDestinations::OrderUserConProfileEvaluator.new(notifier: self, order:),
      triggering_user: Notifier::DynamicDestinations::TriggeringUserEvaluator.new(notifier: self)
    }
  end
end
