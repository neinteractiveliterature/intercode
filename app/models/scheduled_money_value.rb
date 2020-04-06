class ScheduledMoneyValue < ScheduledValue::ScheduledValue
  class TimespanWithMoneyValue < ScheduledValue::TimespanWithValue
    def value=(new_value)
      @value = MoneyCoder.load(new_value)
    end

    def attributes
      super.merge(
        value: MoneyCoder.dump(value)
      )
    end

    def as_json(_options = nil)
      attributes
    end

    def to_s(format = nil, timezone = nil)
      [
        value.format,
        start_description(format, timezone),
        finish_description(format, timezone)
      ].join(' ')
    end
  end

  def self.timespan_with_value_class
    TimespanWithMoneyValue
  end
end
