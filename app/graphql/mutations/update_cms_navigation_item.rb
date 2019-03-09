Mutations::UpdateCmsNavigationItem = GraphQL::Relay::Mutation.define do
  name 'UpdateCmsNavigationItem'
  return_field :cms_navigation_item, Types::CmsNavigationItemType

  input_field :id, !types.Int
  input_field :cms_navigation_item, Types::CmsNavigationItemInputType.to_non_null_type

  resolve ->(_obj, args, ctx) {
    cms_navigation_item = if ctx[:convention]
      ctx[:convention].cms_navigation_items.find(args[:id])
    else
      CmsNavigationItem.global.find(args[:id])
    end
    cms_navigation_item.update!(args[:cms_navigation_item].to_h)
    { cms_navigation_item: cms_navigation_item }
  }
end
