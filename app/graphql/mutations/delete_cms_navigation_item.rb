class Mutations::DeleteCmsNavigationItem < Mutations::BaseMutation
  field :cms_navigation_item, Types::CmsNavigationItemType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    cms_navigation_item = if convention
      convention.cms_navigation_items.find(args[:id])
    else
      CmsNavigationItem.global.find(args[:id])
    end
    cms_navigation_item.destroy!
    { cms_navigation_item: cms_navigation_item }
  end
end
