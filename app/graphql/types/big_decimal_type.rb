class Types::BigDecimalType < Types::BaseScalar
  def self.coerce_input(input_value, _context)
    return nil if input_value.nil?
    BigDecimal(input_value.to_s)
  end

  def self.coerce_result(ruby_value, _context)
    ruby_value&.to_s('F')
  end
end
