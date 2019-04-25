class Types::ContactEmailType < Types::BaseObject
  field :email, String, null: false
  field :name, String, null: true
  field :formatted_address, String, null: false
  field :metadata_json, Types::Json, null: false, method: :metadata
end
