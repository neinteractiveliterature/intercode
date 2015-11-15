class ScheduledValue
  class Timespan
    include Comparable
    attr_reader :start, :finish

    def initialize(start, finish)
      raise "Either start, finish, or both must be specified" unless start || finish

      @start, @finish = start, finish
    end

    def contains?(timestamp)
      return false if start && timestamp < start
      return false if finish && timestamp >= finish

      true
    end

    def overlaps?(other)
      return false if finish && other.start && other.start >= finish
      return false if start && other.finish && start >= other.finish

      true
    end

    def <=>(other)
      case other
      when Timespan
        return nil if other.overlaps?(self)
        return -1 if finish && other.start >= finish
        return 1 if start && other.finish <= start
        0
      when Date, Time, DateTime
        return nil if contains?(other)
        return -1 if finish && other >= finish
        return 1 if start && other < start
        0
      end
    end

    def inspect
      "#<#{self.class.name}: #{to_s}>"
    end

    def to_s
      start_description = if start
        "from #{start}"
      else
        'anytime'
      end

      finish_description = if finish
        "up to #{finish}"
      else
        "indefinitely"
      end

      "#{start_description} #{finish_description}"
    end
  end

  class TimespanWithValue < Timespan
    attr_reader :value

    def initialize(start, finish, value)
      super start, finish
      @value = value
    end

    def to_s
      "#{value} #{super}"
    end
  end

  attr_reader :timespans

  def initialize
    @timespans = SortedSet.new
  end

  def set_value_for_timespan(start, finish, value)
    timespan = TimespanWithValue.new(start, finish, value)
    overlapping_timespan = timespan_overlapping(timespan)
    raise "Timespan for value #{overlapping_timespan} would overlap with #{timespan}" if overlapping_timespan

    @timespans << timespan
    @timespans_array = nil

    value
  end

  def value_at(timestamp)
    timespan = timespan_containing(timestamp)
    raise "No timespan found for #{timestamp}" unless timespan

    timespan.value
  end

  private

  def timespans_array
    @timespans_array ||= timespans.to_a
  end

  def timespan_containing(timestamp)
    timespans_array.bsearch do |timespan|
      if timespan.contains? timestamp
        0
      else
        (timespan <=> timestamp) * -1
      end
    end
  end

  def timespan_overlapping(timespan)
    timespans.find { |my_timespan| my_timespan.overlaps? timespan }
  end
end