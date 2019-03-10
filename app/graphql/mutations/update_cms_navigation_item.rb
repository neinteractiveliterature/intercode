class Mutations::UpdateCmsNavigationItem < Mutations::BaseMutation
  field :cms_navigation_item, Types::CmsNavigationItemType, null: false

  argument :id, Integer, required: true
  argument :cms_navigation_item, Types::CmsNavigationItemInputType, required: false, camelize: false

  def resolve(**args)
    cms_navigation_item = if convention
      convention.cms_navigation_items.find(args[:id])
    else
      CmsNavigationItem.global.find(args[:id])
    end
    cms_navigation_item.update!(args[:cms_navigation_item].to_h)
    { cms_navigation_item: cms_navigation_item }
  end
end
