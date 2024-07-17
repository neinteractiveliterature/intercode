# frozen_string_literal: true
class Types::TimespanWithValueType < Types::BaseObject
  field :start, Types::DateType, null: true
  field :finish, Types::DateType, null: true
  field :value, String, null: false
end
