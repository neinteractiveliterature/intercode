# frozen_string_literal: true
class Types::TimespanWithValueType < Types::BaseObject
  field :finish, Types::DateType, null: true
  field :start, Types::DateType, null: true
  field :value, String, null: false
end
