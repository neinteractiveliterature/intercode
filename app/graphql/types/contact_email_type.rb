# frozen_string_literal: true
class Types::ContactEmailType < Types::BaseObject
  field :email, String, null: false
  field :formatted_address, String, null: false
  field :metadata_json, Types::JSON, null: false, method: :metadata
  field :name, String, null: true
end
