Mutations::DeleteCmsNavigationItem = GraphQL::Relay::Mutation.define do
  name 'DeleteCmsNavigationItem'
  return_field :cms_navigation_item, Types::CmsNavigationItemType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    cms_navigation_item = ctx[:convention].cms_navigation_items.find(args[:id])
    cms_navigation_item.destroy!
    { cms_navigation_item: cms_navigation_item }
  }
end
