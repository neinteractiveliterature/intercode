class Types::SearchResultEntryType < Types::BaseObject
  field :title, String, null: true
  field :highlight, String, null: true
  field :rank, Float, null: false
  field :model, Types::SearchableModelType, null: false
end
