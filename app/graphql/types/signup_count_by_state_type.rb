# frozen_string_literal: true
class Types::SignupCountByStateType < Types::BaseObject
  field :state, Types::SignupStateType, null: false
  field :count, Int, null: false
end
