Holidays
  .between(1.month.ago, 2.years.from_now, :ecbtarget, :observed)
  .map do |holiday|
    BusinessTime::Config.holidays << holiday[:date]
    # Implement long weekends if they apply to the region, eg:
    # BusinessTime::Config.holidays << holiday[:date].next_week if !holiday[:date].weekday?
  end
