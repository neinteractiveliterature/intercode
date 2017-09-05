Types::DateType = GraphQL::ScalarType.define do
  name "Date"
  description "Date in ISO8601 format"

  coerce_input ->(value, _ctx) { DateTime.iso8601(value) }
  coerce_result ->(value, _ctx) { value.iso8601 }
end
