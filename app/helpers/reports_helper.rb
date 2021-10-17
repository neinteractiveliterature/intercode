# frozen_string_literal: true
module ReportsHelper
  def format_run_time(time)
    if time.hour.zero? && time.min.zero?
      'midnight'
    elsif time.hour == 12 && time.min.zero?
      'noon'
    else
      time.strftime('%l:%M%P')
    end
  end

  def format_run_time_compact_hour(time)
    time.min.zero? ? time.strftime('%l%P') : time.strftime('%l:%M%P')
  end

  def format_run_day_and_time(time)
    time.strftime('%a %l:%M%P')
  end
end
