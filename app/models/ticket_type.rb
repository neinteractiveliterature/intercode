class TicketType < ActiveRecord::Base
  belongs_to :convention
  serialize :pricing_schedule, ScheduledValue

  def price_at(time)
    pricing_schedule.value_at(time)
  end
end
