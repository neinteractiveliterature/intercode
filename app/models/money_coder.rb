module MoneyCoder
  def self.load(value)
    case value
    when nil then nil
    when Money then value
    when Hash
      symbolized_value = value.symbolize_keys
      Money.new(symbolized_value[:fractional], symbolized_value[:currency_code])
    else
      raise TypeError, "Can't convert #{value.inspect} to Money value"
    end
  end

  def self.dump(value)
    return nil unless value
    { fractional: value.fractional, currency_code: value.currency.iso_code }
  end
end
