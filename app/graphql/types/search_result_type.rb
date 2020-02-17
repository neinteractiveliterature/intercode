class Types::SearchResultType < Types::BaseObject
  field :total_entries, Int, null: false
  field :entries, [Types::SearchResultEntryType], null: false
end
