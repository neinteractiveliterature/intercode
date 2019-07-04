class Types::CmsPartialType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :content, String, null: true
  field :admin_notes, String, null: true do
    authorize_action :update
  end
end
