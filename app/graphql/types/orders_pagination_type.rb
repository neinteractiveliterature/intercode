class Types::OrdersPaginationType < Types::BaseObject

  field :total_entries, Integer, null: false
  field :total_pages, Integer, null: false
  field :current_page, Integer, null: false
  field :per_page, Integer, null: false
  field :entries, [Types::OrderType, null: true], null: false

  def entries
    @object.to_a
  end
end
