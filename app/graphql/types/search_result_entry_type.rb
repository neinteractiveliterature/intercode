# frozen_string_literal: true
class Types::SearchResultEntryType < Types::BaseObject
  field :highlight, String, null: true
  field :model, Types::SearchableModelType, null: false
  field :rank, Float, null: false
  field :title, String, null: true
end
