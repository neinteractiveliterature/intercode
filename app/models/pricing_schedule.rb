class PricingSchedule
  class Timespan
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

    def overlaps?(timespan)
      return false if finish && timespan.start && timespan.start >= finish
      return false if start && timespan.finish && start >= timespan.finish

      true
    end

    def inspect
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

      "#<#{self.class.name}: #{start_description} #{finish_description}>"
    end
  end

  attr_reader :price_by_timespan

  def initialize
    @price_by_timespan = {}
  end

  def set_price_for_timespan(price, start, finish)
    timespan = Timespan.new(start, finish)
    overlapping_timespan = timespan_overlapping(timespan)
    raise "Timespan for price #{price_by_timespan[overlapping_timespan]} (#{overlapping_timespan}) would overlap with #{timespan}" if overlapping_timespan

    price_by_timespan[timespan] = price
  end

  def price_at(timestamp)
    timespan = timespan_containing(timestamp)
    raise "No timespan found for #{timestamp}" unless timespan

    price_by_timespan[timespan]
  end

  private

  def timespan_containing(timestamp)
    price_by_timespan.keys.find { |timespan| timespan.contains? timestamp }
  end

  def timespan_overlapping(timespan)
    price_by_timespan.keys.find { |my_timespan| my_timespan.overlaps? timespan }
  end
end