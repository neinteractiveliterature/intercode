class Types::CmsGraphqlQueryType < Types::BaseObject
  field :id, Int, null: false
  field :identifier, String, null: false
  field :query, String, null: false
  field :admin_notes, String, null: true do
    authorize_action :update
  end
end
