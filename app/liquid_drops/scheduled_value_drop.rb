# A ScheduledValue represents a value that changes over time.  For example, the convention's
# maximum allowed signups and the price of ticket types are ScheduledValues.
class ScheduledValueDrop < Liquid::Drop
  # @api
  attr_reader :scheduled_value

  # @return [ActiveSupport::TimeWithZone] The current time, as used for calculating the value of
  #                                       this ScheduledValue
  attr_reader :now

  # @return [ActiveSupport::TimeZone] The time zone used for calculating the value of this
  #                                   ScheduledValue
  attr_reader :timezone

  delegate :covers_all_time?, to: :scheduled_value

  # @return [Boolean] Whether or not this ScheduledValue covers all possible times
  alias covers_all_time covers_all_time?

  # @api
  def initialize(scheduled_value, timezone)
    @scheduled_value = scheduled_value
    @timezone = timezone
    @now = Time.now.in_time_zone(timezone)
  end

  # @return [Array<TimespanWithValueDrop>] The timespans covered by this ScheduledValue, along with
  #                                        the value for that range of time
  def timespans
    scheduled_value.timespans.map do |timespan|
      TimespanWithValueDrop.new(timespan, timezone)
    end
  end

  # @return The current value of this ScheduledValue (type may vary)
  def current_value
    @current_value ||= scheduled_value.value_at(now)
  end

  # @return [ActiveSupport::TimeWithZone] When the current value came into effect
  def current_value_change
    @current_value ||= begin
      scheduled_value.send(:timespan_containing, now)&.start&.in_time_zone(timezone)
    end
  end

  # @return [ActiveSupport::TimeWithZone] When the value will next change
  def next_value_change
    @next_value_change ||= scheduled_value.next_value_change_after(now)&.in_time_zone(timezone)
  end

  # @return What the value will be after it next changes (type may vary)
  def next_value
    return nil unless next_value_change
    scheduled_value.value_at(next_value_change)
  end
end
