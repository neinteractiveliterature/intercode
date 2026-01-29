# frozen_string_literal: true
class Types::SearchResultType < Types::BaseObject
  description "A paginated search result containing matching entries and total count"

  field :entries, [Types::SearchResultEntryType], null: false, description: "The results of the search"
  field :total_entries, Int, null: false, description: "The total number of entries matching the search query"

  def entries
    object.entries.filter { |entry| policy(entry.model).read? }
  end
end
