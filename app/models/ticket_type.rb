class TicketType < ApplicationRecord
  belongs_to :convention

  has_many :tickets
  has_many :maximum_event_provided_tickets_overrides
  has_many :providing_products,
    class_name: 'Product', foreign_key: 'provides_ticket_type_id', dependent: :nullify

  # Only allow letters, numbers, and underscores
  validates :name, format: { with: /\A\w+\z/, allow_blank: true }

  scope :publicly_available, -> { where(publicly_available: true) }
  scope :event_provided, -> { where('maximum_event_provided_tickets > 0') }

  def maximum_event_provided_tickets_for_event_id(event_id)
    (
      maximum_event_provided_tickets_overrides.find_by(event_id: event_id)&.override_value ||
      maximum_event_provided_tickets
    )
  end

  def price_at(time)
    pricing_schedule.value_at(time)
  end

  def price
    price_at(Time.zone.now)
  end

  def next_price_change_after(time)
    pricing_schedule.next_value_change_after(time)
  end

  def next_price_change
    next_price_change_after(Time.zone.now)
  end

  def next_price_after(time)
    next_change = next_price_change_after(time)
    return unless next_change

    pricing_schedule.value_at(next_change)
  end

  def next_price
    next_price_after(Time.zone.now)
  end

  def event_provided?
    maximum_event_provided_tickets > 0
  end

  def to_liquid
    TicketTypeDrop.new(self)
  end
end
