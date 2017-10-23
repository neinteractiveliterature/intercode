module ReportsHelper
  def format_run_time(time)
    if time.hour == 0 && time.min == 0
      'midnight'
    elsif time.hour == 12 && time.min == 0
      'noon'
    else
      time.strftime('%l:%M%P')
    end
  end

  def format_run_day_and_time(time)
    time.strftime('%a %l:%M%P')
  end
end
