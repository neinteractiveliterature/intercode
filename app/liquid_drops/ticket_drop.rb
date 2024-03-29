# frozen_string_literal: true
# A ticket for this convention (which may allow its holder to sign up for events)
class TicketDrop < Liquid::Drop
  # @api
  attr_reader :ticket

  # @!method id
  #   @return [Integer] The numeric database ID of this ticket
  # @!method user_con_profile
  #   @return [UserConProfileDrop] The profile of the ticket holder
  # @!method provided_by_event
  #   @return [EventDrop] The event that provided this ticket, if applicable
  # @!method allows_event_signups
  #   @return [Boolean] Whether or not this ticket allows its holder to sign up for events
  # @!method ticket_type
  #   @return [TicketTypeDrop] The type of this ticket
  # @!method created_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this ticket was first created in the
  #                                         database
  # @!method updated_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this ticket was last updated in the
  #                                         database
  delegate :id,
           :user_con_profile,
           :provided_by_event,
           :allows_event_signups,
           :ticket_type,
           :created_at,
           :updated_at,
           to: :ticket

  # @!method name
  #   @return [String] The unique name of the type of this ticket
  # @!method description
  #   @return [String] The human-readable description of the type of this ticket
  delegate :name, :description, to: :ticket_type, prefix: true

  # @api
  def initialize(ticket)
    @ticket = ticket
  end

  # @return [String] The ID of the charge in the underlying payment processing system
  # @deprecated Use order_entry for payment fields
  def charge_id
    ticket.order_entry&.order&.charge_id
  end

  # @return [MoneyDrop] The amount the person paid for the ticket
  # @deprecated Use order_entry for payment fields
  def payment_amount
    ticket.order_entry&.price_per_item
  end
end
