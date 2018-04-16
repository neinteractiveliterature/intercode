class Types::PageType < Types::BaseObject

  field :id, Integer, null: false
  field :name, String, null: true
  field :slug, String, null: true
  field :content, String, null: true
  field :admin_notes, String, null: true do
    guard ->(page, _args, ctx) do
      ctx[:current_ability].can?(:update, page)
    end
  end
end
