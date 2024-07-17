# frozen_string_literal: true
class Types::SearchResultType < Types::BaseObject
  field :entries, [Types::SearchResultEntryType], null: false
  field :total_entries, Int, null: false
end
