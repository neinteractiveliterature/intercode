class Intercode::Import::Intercode1::Tables::PriceSchedule < Intercode::Import::Intercode1::Table
  attr_reader :con, :price_schedule

  def initialize(connection, con, price_schedule)
    super(connection)

    @price_schedule = price_schedule
    @con = con
  end

  def build_ticket_type
    con.ticket_types.new(
      name: "weekend",
      description: "Full-weekend ticket",
      pricing_schedule: price_schedule_converted
    )
  end

  private
  def price_schedule_converted
    timespans = price_schedule.map do |price_point|
      {
        start: convert_date(price_point['start_date']),
        finish: convert_date(price_point['end_date']),
        value: { fractional: price_point['price'] * 100, currency_code: 'USD' }
      }
    end

    { timespans: timespans }
  end

  def convert_date(date)
    return nil if date == 0
    Time.at(date).in_time_zone(con.timezone).beginning_of_day
  end
end