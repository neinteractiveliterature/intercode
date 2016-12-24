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

    def serializable_hash(options = {})
      return nil unless value
      super((options || {}).merge(except: :value)).merge(value: { fractional: value.fractional, currency_code: value.currency.iso_code })
    end

    def to_s(format = nil)
      "#{value.format} #{start_description(format)} #{finish_description(format)}"
    end
  end

  def self.timespan_with_value_class
    TimespanWithMoneyValue
  end
end