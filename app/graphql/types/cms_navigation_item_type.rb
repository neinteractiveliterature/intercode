# frozen_string_literal: true
class Types::CmsNavigationItemType < Types::BaseObject
  field :id,
        Integer,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :position, Integer, null: true
  field :title, String, null: true

  field :navigation_section, Types::CmsNavigationItemType, null: true
  field :navigation_items, [Types::CmsNavigationItemType, { null: true }], null: true
  field :page, Types::PageType, null: true

  association_loaders CmsNavigationItem, :navigation_section, :navigation_items, :page
end
