class Intercode::Import::Intercode1::Tables::PriceSchedule < Intercode::Import::Intercode1::Table
  attr_reader :con, :price_schedule, :php_timezone

  def initialize(connection, con, price_schedule, php_timezone)
    super(connection)

    @price_schedule = price_schedule
    @con = con
    @php_timezone = php_timezone
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

  def convert_date(unix_timestamp)
    return nil if unix_timestamp == 0

    date = Time.at(unix_timestamp).in_time_zone(php_timezone).to_date
    con.timezone.local(date.year, date.month, date.day, 0, 0, 0)
  end
end
