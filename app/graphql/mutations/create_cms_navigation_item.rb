Mutations::CreateCmsNavigationItem = GraphQL::Relay::Mutation.define do
  name 'CreateCmsNavigationItem'
  return_field :cms_navigation_item, Types::CmsNavigationItemType

  input_field :cms_navigation_item, !Types::CmsNavigationItemInputType

  resolve ->(_obj, args, ctx) {
    cms_navigation_item = ctx[:convention].cms_navigation_items.create!(args[:cms_navigation_item].to_h)
    { cms_navigation_item: cms_navigation_item }
  }
end
