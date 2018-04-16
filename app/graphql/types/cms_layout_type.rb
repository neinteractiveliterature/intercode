class Types::CmsLayoutType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :content, String, null: true
  field :navbar_classes, String, null: true
  field :admin_notes, String, null: true, guard: ->(page, _args, ctx) do
      ctx[:current_ability].can?(:update, page)
    end
end
