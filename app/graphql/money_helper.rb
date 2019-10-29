module MoneyHelper
  def self.coerce_money_input(input)
    return nil unless input

    input = input.to_h.symbolize_keys
    Money.new(input[:fractional], input[:currency_code])
  end
end
