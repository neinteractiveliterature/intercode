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
  # @!method payment_amount
  #   @return [Money] The amount the person paid for the ticket
  # @!method allows_event_signups
  #   @return [Boolean] Whether or not this ticket allows its holder to sign up for events
  # @!method ticket_type
  #   @return [TicketTypeDrop] The type of this ticket
  delegate :id, :user_con_profile, :provided_by_event, :payment_amount, :allows_event_signups,
    :ticket_type, to: :ticket

  # @!method name
  #   @return [String] The unique name of the type of this ticket
  # @!method description
  #   @return [String] The human-readable description of the type of this ticket
  delegate :name, :description, to: :ticket_type, prefix: true

  # @api
  def initialize(ticket)
    @ticket = ticket
  end
end
