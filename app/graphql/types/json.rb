# frozen_string_literal: true
class Types::JSON < Types::BaseScalar
  graphql_name 'Json' # for backwards compatibility
  description 'An arbitrary object, serialized as JSON'

  def self.coerce_input(input_value, _context)
    return nil if input_value.nil?
    Oj.load(input_value)
  end

  def self.coerce_result(ruby_value, _context)
    return nil unless ruby_value
    Oj.dump(ruby_value.as_json)
  end
end
