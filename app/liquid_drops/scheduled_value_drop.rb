class ScheduledValueDrop < Liquid::Drop
  attr_reader :scheduled_value, :now
  delegate :covers_all_time?, to: :scheduled_value
  alias_method :covers_all_time, :covers_all_time?

  def initialize(scheduled_value)
    @scheduled_value = scheduled_value
    @now = Time.now
  end

  def timespans
    scheduled_value.timespans.map do |timespan|
      TimespanWithValueDrop.new(timespan)
    end
  end

  def current_value
    @current_value ||= scheduled_value.value_at(now)
  end

  def next_value_change
    @next_value_change ||= scheduled_value.next_value_change_after(now)
  end

  def next_value
    return nil unless next_value_change
    scheduled_value.value_at(next_value_change)
  end
end
