Types::CmsNavigationItemInputType = GraphQL::InputObjectType.define do
  name 'CmsNavigationItemInput'

  input_field :title, types.String
  input_field :position, types.Int
  input_field :navigation_section_id, types.Int
  input_field :page_id, types.Int
end
