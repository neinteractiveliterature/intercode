# frozen_string_literal: true
class Types::OrderQuantityByStatusType < Types::BaseObject
  field :quantity, Integer, null: false
  field :status, String, null: false
end
