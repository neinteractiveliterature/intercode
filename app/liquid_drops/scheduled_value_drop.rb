class ScheduledValueDrop < Liquid::Drop
  attr_reader :scheduled_value
  delegate :covers_all_time?, to: :scheduled_value
  alias_method :covers_all_time, :covers_all_time?

  def initialize(scheduled_value)
    @scheduled_value = scheduled_value
  end

  def timespans
    scheduled_value.timespans.map do |timespan|
      TimespanWithValueDrop.new(timespan)
    end
  end
end