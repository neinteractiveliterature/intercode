class Mutations::SortCmsNavigationItems < Mutations::BaseMutation
  argument :sort_items, [Mutations::UpdateCmsNavigationItem.input_type], required: true,
    camelize: false

  authorize_arbitrary_cms_model :cms_navigation_items, :update

  def resolve(**args)
    args[:sort_items].each do |sort_item|
      cms_navigation_item_attrs = sort_item[:cms_navigation_item].to_h.symbolize_keys
        .slice(:position, :navigation_section_id)
      cms_parent.cms_navigation_items.where(id: sort_item[:id])
        .update_all(cms_navigation_item_attrs)
    end

    cms_parent.touch # invalidate the navigation bar cache

    {}
  end
end
