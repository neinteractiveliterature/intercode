class ScheduledMoneyValue < ScheduledValue::ScheduledValue
  class TimespanWithMoneyValue < ScheduledValue::TimespanWithValue
    def value=(new_value)
      @value = case new_value
      when nil then nil
      when Money then new_value
      when Hash
        symbolized_value = new_value.symbolize_keys
        Money.new(symbolized_value[:fractional], symbolized_value[:currency_code])
      else
        raise "Can't convert #{new_value.inspect} to Money value"
      end
    end

    def attributes
      return super unless value
      super.merge(
        value: { fractional: value.fractional, currency_code: value.currency.iso_code }
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
