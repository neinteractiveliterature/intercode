class TimespanWithValueDrop < Liquid::Drop
  attr_reader :timespan_with_value, :timezone

  def initialize(timespan_with_value, timezone)
    @timespan_with_value = timespan_with_value
    @timezone = timezone
  end

  def start
    @start ||= timespan_with_value.start&.in_time_zone(timezone)
  end

  def finish
    @finish ||= timespan_with_value.finish&.in_time_zone(timezone)
  end

  def description
    timespan_with_value.to_s(:date_only)
  end

  def description_without_value
    "#{timespan_with_value.start_description(:date_only)} #{timespan_with_value.finish_description(:date_only)}"
  end

  def short_description
    "#{value} #{short_description_without_value}"
  end

  def short_description_without_value
    if start && finish
      "#{start.to_s(:date_only)} &mdash; #{finish.to_s(:date_only)}"
    elsif start
      "#{start.to_s(:date_only)} onwards"
    elsif finish
      "up to #{finish.to_s(:date_only)}"
    else
      ''
    end
  end

  def value
    value_object = timespan_with_value.value

    case value_object
    when Money then value_object.format
    else value_object
    end
  end
end
