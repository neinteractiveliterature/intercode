class TicketType < ApplicationRecord
  belongs_to :convention
  serialize :pricing_schedule, ActiveModelCoder.new('ScheduledMoneyValue')

  has_many :tickets

  # Only allow letters, numbers, and underscores
  validates_format_of :name, with: /\A\w+\z/, allow_blank: true

  def price_at(time)
    pricing_schedule.value_at(time)
  end

  def price
    price_at(Time.now)
  end

  def next_price_change_after(time)
    pricing_schedule.next_value_change_after(time)
  end

  def next_price_change
    next_price_change_after(Time.now)
  end

  def next_price_after(time)
    next_change = next_price_change_after(time)
    return unless next_change

    pricing_schedule.value_at(next_change)
  end

  def next_price
    next_price_after(Time.now)
  end

  def to_liquid
    TicketTypeDrop.new(self)
  end
end
