class ProvideEventTicketService < CivilService::Service
  include SkippableAdvisoryLock
  include ActionView::Helpers::TextHelper

  class Result < CivilService::Result
    attr_accessor :ticket
  end
  self.result_class = Result

  self.validate_manually = true
  validate :ticket_type_must_be_providable
  validate :event_must_be_able_to_provide_tickets
  validate :event_must_have_remaining_tickets_of_type
  validate :user_con_profile_must_not_have_ticket

  attr_reader :event, :user_con_profile, :ticket_type

  delegate :convention, to: :event

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
        user_con_profile: user_con_profile
      )
    end

    success(ticket: ticket)
  end

  def maximum_event_provided_tickets_for_event
    @maximum_event_provided_tickets_for_event ||= (
      ticket_type.maximum_event_provided_tickets_for_event_id(event.id)
    )
  end

  def ticket_type_must_be_providable
    return unless maximum_event_provided_tickets_for_event < 1
    errors.add :base, "#{ticket_type.name} #{convention.ticket_name.pluralize} cannot be provided \
by #{event.title}"
  end

  def event_must_be_able_to_provide_tickets
    return if event.event_category.can_provide_tickets?
    errors.add :base, "#{event.title} cannot provide #{convention.ticket_name.pluralize} to \
attendees"
  end

  def event_must_have_remaining_tickets_of_type
    return unless maximum_event_provided_tickets_for_event > 0

    already_provided_count = event.provided_tickets.count { |t| t.ticket_type == ticket_type }
    return unless already_provided_count >= maximum_event_provided_tickets_for_event

    errors.add :base, "#{event.title} can provide up to \
#{pluralize maximum_event_provided_tickets_for_event, convention.ticket_name}, and it has already \
provided #{already_provided_count}"
  end

  def user_con_profile_must_not_have_ticket
    return unless user_con_profile.ticket&.persisted?
    errors.add :base, "#{user_con_profile.name} already has a #{convention.ticket_name} to \
#{user_con_profile.convention.name}"
  end
end
