class ProvideEventTicketService < ApplicationService
  include ActionView::Helpers::TextHelper

  class Result < ServiceResult
    attr_accessor :ticket
  end
  self.result_class = Result

  self.validate_manually = true
  validate :ticket_type_must_be_providable
  validate :event_must_have_remaining_tickets_of_type
  validate :user_con_profile_must_not_have_ticket

  attr_reader :event, :user_con_profile, :ticket_type

  def initialize(event, user_con_profile, ticket_type)
    @event = event
    @user_con_profile = user_con_profile
    @ticket_type = ticket_type
  end

  private

  def inner_call
    ticket = nil

    with_advisory_lock_unless_skip_locking("event_#{event.id}_provided_tickets") do
      return failure(errors) unless valid?

      ticket = event.provided_tickets.create!(
        ticket_type: ticket_type,
        user_con_profile: user_con_profile,
        payment_amount: Money.new(0, 'USD')
      )
    end

    success(ticket: ticket)
  end

  def ticket_type_must_be_providable
    if ticket_type.maximum_event_provided_tickets < 1
      errors.add :base, "#{ticket_type.name} tickets cannot be provided by events"
    end
  end

  def event_must_have_remaining_tickets_of_type
    return unless ticket_type.maximum_event_provided_tickets > 0

    already_provided_count = event.provided_tickets.select { |t| t.ticket_type == ticket_type }.size

    if already_provided_count >= ticket_type.maximum_event_provided_tickets
      errors.add :base, "Events can provide up to #{pluralize ticket_type.maximum_event_provided_tickets, 'ticket'}, and #{event.title} has already provided #{already_provided_count}"
    end
  end

  def user_con_profile_must_not_have_ticket
    if user_con_profile.ticket
      errors.add :base, "#{user_con_profile.name} already has a ticket to #{user_con_profile.convention.name}"
    end
  end
end
