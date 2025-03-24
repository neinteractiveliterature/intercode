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

  def destinations
    [ticket.user_con_profile]
  end

  def self.default_destinations(**)
    [:ticket_user_con_profile]
  end

  def self.allowed_dynamic_destinations
    %i[ticket_user_con_profile]
  end
end
