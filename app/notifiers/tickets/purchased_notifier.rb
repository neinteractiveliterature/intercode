# frozen_string_literal: true
class Tickets::PurchasedNotifier < Notifier
  attr_reader :ticket

  def initialize(ticket:)
    @ticket = ticket
    super(convention: ticket.convention, event_key: "tickets/purchased")
  end

  def liquid_assigns
    super.merge("ticket" => ticket)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :ticket_user_con_profile)]
  end

  def self.allowed_dynamic_destinations
    %i[ticket_user_con_profile]
  end

  def dynamic_destination_evaluators
    {
      ticket_user_con_profile: Notifier::DynamicDestinations::TicketUserConProfileEvaluator.new(notifier: self, ticket:)
    }
  end
end
