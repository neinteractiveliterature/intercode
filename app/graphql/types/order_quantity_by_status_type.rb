# frozen_string_literal: true
class Types::OrderQuantityByStatusType < Types::BaseObject
  field :status, String, null: false
  field :quantity, Integer, null: false
end
