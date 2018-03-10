Types::CmsLayoutType = GraphQL::ObjectType.define do
  name 'CmsLayout'

  field :id, !types.Int
  field :name, types.String
  field :content, types.String
  field :navbar_classes, types.String
  field :admin_notes, types.String do
    guard ->(page, _args, ctx) do
      ctx[:current_ability].can?(:update, page)
    end
  end
end
