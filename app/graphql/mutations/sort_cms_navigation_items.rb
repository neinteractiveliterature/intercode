Mutations::SortCmsNavigationItems = GraphQL::Relay::Mutation.define do
  name 'SortCmsNavigationItems'

  input_field :sort_items, !types[Mutations::UpdateCmsNavigationItem.input_type]

  resolve ->(_obj, args, ctx) {
    args[:sort_items].each do |sort_item|
      cms_navigation_item_attrs = sort_item[:cms_navigation_item].to_h.symbolize_keys
        .slice(:position, :navigation_section_id)
      ctx[:convention].cms_navigation_items.where(id: sort_item[:id]).update_all(cms_navigation_item_attrs)
    end

    {}
  }
end
