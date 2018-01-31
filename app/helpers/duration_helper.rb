module DurationHelper
  def format_duration(duration)
    hours = duration / 1.hour
    minutes = (duration % 1.hour) / 1.minute
    seconds = (duration % 1.minute)

    if seconds > 0
      '%02d:%02d:%02d' % [hours, minutes, seconds]
    else
      '%02d:%02d' % [hours, minutes]
    end
  end

  # Generate an array of times.  These can be used to create an option list
  # for a drop-down list, where the ID for each entry is the time of the
  # event in seconds.  Events are (currently) scheduled with a granularity
  # of 1/4 hours...
  def duration_options(min_duration, max_duration, step = 15.minutes)
    (min_duration..max_duration).step(step).map do |duration|
      [format_duration(duration), duration]
    end
  end

  # Generate an array of times for a LARP
  def larp_length_options
    duration_options(1.hour, 14.hours)
  end
end
