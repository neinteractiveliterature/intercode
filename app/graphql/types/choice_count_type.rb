# frozen_string_literal: true
class Types::ChoiceCountType < Types::BaseObject
  field :choice, Integer, null: false
  field :count, Integer, null: false
  field :state, Types::SignupStateType, null: false
end
