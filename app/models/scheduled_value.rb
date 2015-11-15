class ScheduledValue
  class Timespan
    include Comparable
    include ActiveModel::Model
    include ActiveModel::Serializers::JSON
    attr_accessor :start, :finish

    def initialize(attributes = {})
      super

      raise "Either start, finish, or both must be specified" unless start || finish
      raise "Finish must be after start" if start && finish && start >= finish
    end

    def attributes
      {
        start: start,
        finish: finish
      }
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
      when Timespan then compare_timespan(other)
      when Date, Time, DateTime then compare_datetime(other)
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

    private
    def compare_timespan(other)
      return 0 if other.start == start && other.finish == finish
      return nil if other.overlaps?(self)
      return -1 if finish && other.start && other.start >= finish
      return 1 if start && other.finish && other.finish <= start
    end

    def compare_datetime(other)
      return nil if contains?(other)
      return -1 if finish && other >= finish
      return 1 if start && other < start
      0
    end
  end

  class TimespanWithValue < Timespan
    attr_accessor :value

    def attributes
      super.merge(value: value)
    end

    def to_s
      "#{value} #{super}"
    end
  end

  include ActiveModel::Model
  include ActiveModel::Serializers::JSON
  extend ActsAsCoder

  attr_reader :timespans

  def attributes
    {
      timespans: timespans
    }
  end

  def timespans=(timespan_values)
    @timespans = SortedSet.new
    @timespans.tap do |timespans|
      timespan_values.each do |timespan_value|
        timespan = case timespan_value
        when TimespanWithValue then timespan_value
        when Hash then TimespanWithValue.new(timespan_value)
        end

        self << timespan
      end
    end
  end

  def <<(timespan_with_value)
    overlapping_timespan = timespan_overlapping(timespan_with_value)
    raise "Timespan for value #{overlapping_timespan} would overlap with #{timespan_with_value}" if overlapping_timespan

    @timespans << timespan_with_value
    @timespans_array = nil

    timespan_with_value
  end

  def set_value_for_timespan(start, finish, value)
    self << TimespanWithValue.new(start: start, finish: finish, vaule: value)
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