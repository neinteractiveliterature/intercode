# frozen_string_literal: true
class Types::CmsNavigationItemType < Types::BaseObject
  description "A link or section in a CMS navigation bar"
  field :id, ID, null: false, description: "The ID of this navigation item"
  field :position, Integer, null: true, description: "Where this item appears relative to its siblings"
  field :title, String, null: true, description: "The text shown in the navigation bar"

  field :navigation_section,
        Types::CmsNavigationItemType,
        association_model: CmsNavigationItem,
        null: true,
        description: "The section containing this item, if it is inside one"
  field :page,
        Types::PageType,
        association_model: CmsNavigationItem,
        null: true,
        description: "The page this item links to, if it is a link"
end
