class Types::CmsPartialType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :content, String, null: true
  field :admin_notes, String, null: true do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:update, graphql_object.object)
    end
  end
end
