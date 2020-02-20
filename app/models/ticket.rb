class Ticket < ApplicationRecord
  belongs_to :user_con_profile
  belongs_to :ticket_type
  belongs_to :provided_by_event, class_name: 'Event', optional: true, inverse_of: 'provided_tickets'

  validates :user_con_profile, :ticket_type, presence: true
  validates :user_con_profile, uniqueness: true
  validate :ticket_type_must_be_valid_for_convention
  validate :provided_by_event_must_be_part_of_convention, on: :create

  delegate :convention, to: :user_con_profile
  delegate :user, to: :user_con_profile
  delegate :allows_event_signups?, :allows_event_signups, to: :ticket_type

  monetize :payment_amount_cents, with_model_currency: :payment_amount_currency, allow_nil: true

  scope :counts_towards_convention_maximum, -> {
    joins(:ticket_type).where(ticket_types: { counts_towards_convention_maximum: true })
  }

  after_commit :send_user_activity_alerts, on: :create

  def to_liquid
    TicketDrop.new(self)
  end

  private

  def ticket_type_must_be_valid_for_convention
    return unless ticket_type
    return if convention.ticket_types.include?(ticket_type)

    errors.add(:ticket_type, "is not a valid #{convention.ticket_name} type for #{convention.name}")
  end

  def provided_by_event_must_be_part_of_convention
    return unless provided_by_event
    return if convention.events.include?(provided_by_event)

    errors.add(:provided_by_event, "is not part of #{convention}")
  end

  def send_user_activity_alerts
    SendUserActivityAlertsJob.perform_later(user_con_profile, 'ticket_create')
  end
end
