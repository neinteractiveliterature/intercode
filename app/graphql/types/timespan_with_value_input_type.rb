# frozen_string_literal: true
class Types::TimespanWithValueInputType < Types::BaseInputObject
  argument :start, Types::DateType, required: false
  argument :finish, Types::DateType, required: false

  # Add additional typed value fields here as appropriate
  argument :string_value, String, required: false, camelize: false
end
