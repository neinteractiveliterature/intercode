# frozen_string_literal: true
# A timespan inside a ScheduledValue that associates a range of time with a particular value
class TimespanWithValueDrop < Liquid::Drop
  # @api
  attr_reader :timespan_with_value

  # @return [ActiveSupport::TimeZone] The time zone used for calculating the range of time
  attr_reader :timezone

  # @api
  def initialize(timespan_with_value, timezone)
    @timespan_with_value = timespan_with_value
    @timezone = timezone
  end

  # @return [ActiveSupport::TimeWithZone] When the timespan starts.  (This moment is considered
  #                                       part of the timespan.)
  def start
    @start ||= timespan_with_value.start&.in_time_zone(timezone)
  end

  # @return [ActiveSupport::TimeWithZone] When the timespan ends.  (This moment is NOT considered
  #                                       part of the timespan.)
  def finish
    @finish ||= timespan_with_value.finish&.in_time_zone(timezone)
  end

  # @return [String] A human-readable description of the timespan and its value
  # @example
  #   "$30.00 from January 3, 2018 up to January 9, 2018"
  # @example
  #   "42 from November 22, 2017 indefinitely"
  # @example
  #   "$10.25 anytime up to April 13, 1972"
  # @example
  #   "10 anytime"
  def description
    timespan_with_value.to_s(:date_only)
  end

  # @return [String] A human-readable description of just the timespan without its value
  # @example
  #   "from January 3, 2018 up to January 9, 2018"
  # @example
  #   "from November 22, 2017 indefinitely"
  # @example
  #   "anytime up to April 13, 1972"
  # @example
  #   "anytime"
  def description_without_value
    [timespan_with_value.start_description(:date_only), timespan_with_value.finish_description(:date_only)].join(' ')
  end

  # @return [String] A shorter format of the human-readable description of the timespan and its
  #                  value
  # @example
  #   "$30.00 January 3, 2018 - January 9, 2018"
  # @example
  #   "42 November 22, 2017 onwards"
  # @example
  #   "$10.25 up to April 13, 1972"
  # @example
  #   "10"
  def short_description
    "#{value} #{short_description_without_value}"
  end

  # @return [String] A shorter format of the human-readable description of the timespan, without its
  #                  value
  # @example
  #   "January 3, 2018 - January 9, 2018"
  # @example
  #   "November 22, 2017 onwards"
  # @example
  #   "up to April 13, 1972"
  # @example Infinite timespans return an empty string
  #   ""
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

  # @return [String] The value for this timespan, formatted as a string
  def value
    value_object = timespan_with_value.value

    case value_object
    when Money
      value_object.format
    else
      value_object
    end
  end
end
