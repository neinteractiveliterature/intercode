# A range of time.  Both "start" and "finish" are optional; omitting either of them will lead to
# an infinite-length timespan.
class ScheduledValue::TimespanDrop < Liquid::Drop
  # @api
  attr_reader :timespan

  # @!method start
  #   @return [ActiveSupport::TimeWithZone] The start of the timespan (or null if it has no start)
  # @!method finish
  #   @return [ActiveSupport::TimeWithZone] The end of the timespan (or null if it has no end)
  delegate :start, :finish, to: :timespan

  # @api
  def initialize(timespan)
    @timespan = timespan
  end
end
