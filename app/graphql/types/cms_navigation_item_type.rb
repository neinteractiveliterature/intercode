# frozen_string_literal: true
class Types::CmsNavigationItemType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :position, Integer, null: true
  field :title, String, null: true

  field :navigation_section, Types::CmsNavigationItemType, null: true
  field :navigation_items, [Types::CmsNavigationItemType, { null: true }], null: true
  field :page, Types::PageType, null: true

  association_loaders CmsNavigationItem, :navigation_section, :navigation_items, :page
end
