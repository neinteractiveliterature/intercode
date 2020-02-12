class Types::DateType < Types::BaseScalar
  description 'Date in ISO8601 format'

  def self.coerce_input(value, _ctx)
    return nil if value.nil?
    DateTime.iso8601(value)
  end

  def self.coerce_result(value, _ctx)
    value&.iso8601
  end
end
