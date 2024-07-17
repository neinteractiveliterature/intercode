# frozen_string_literal: true
class Types::SignupCountByStateType < Types::BaseObject
  field :count, Int, null: false
  field :state, Types::SignupStateType, null: false
end
