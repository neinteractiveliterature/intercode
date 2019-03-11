class Types::CmsNavigationItemType < Types::BaseObject
  field :id, Integer, null: false
  field :position, Integer, null: true
  field :title, String, null: true

  field :navigation_section, Types::CmsNavigationItemType, null: true
  field :navigation_items, [Types::CmsNavigationItemType, null: true], null: true
  field :page, Types::PageType, null: true

  association_loaders CmsNavigationItem, :navigation_section, :navigation_items, :page
end
