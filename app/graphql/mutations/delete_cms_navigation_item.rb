class Mutations::DeleteCmsNavigationItem < Mutations::BaseMutation
  field :cms_navigation_item, Types::CmsNavigationItemType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    cms_navigation_item = cms_parent.cms_navigation_items.find(args[:id])
    cms_navigation_item.destroy!
    { cms_navigation_item: cms_navigation_item }
  end
end
