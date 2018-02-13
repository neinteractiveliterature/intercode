Types::PageType = GraphQL::ObjectType.define do
  name 'Page'

  field :id, !types.Int
  field :name, types.String
  field :slug, types.String
  field :content, types.String
  field :admin_notes, types.String do
    guard ->(page, _args, ctx) do
      ctx[:current_ability].can?(:update, page)
    end
  end
end
