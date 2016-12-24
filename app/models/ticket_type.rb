class TicketType < ApplicationRecord
  belongs_to :convention
  serialize :pricing_schedule, ActiveModelCoder.new('ScheduledMoneyValue')

  has_many :tickets

  # Only allow letters, numbers, and underscores
  validates_format_of :name, with: /\A\w+\z/, allow_blank: true

  def price_at(time)
    pricing_schedule.value_at(time)
  end
end
