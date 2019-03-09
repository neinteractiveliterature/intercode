Mutations::CreateCmsNavigationItem = GraphQL::Relay::Mutation.define do
  name 'CreateCmsNavigationItem'
  return_field :cms_navigation_item, Types::CmsNavigationItemType

  input_field :cms_navigation_item, Types::CmsNavigationItemInputType.to_non_null_type

  resolve ->(_obj, args, ctx) {
    cms_navigation_item = CmsNavigationItem
      .create!(args[:cms_navigation_item].to_h.merge(parent: ctx[:convention]))
    { cms_navigation_item: cms_navigation_item }
  }
end
