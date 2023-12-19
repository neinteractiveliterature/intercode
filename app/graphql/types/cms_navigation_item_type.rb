# frozen_string_literal: true
class Types::CmsNavigationItemType < Types::BaseObject
  field :id, ID, null: false
  field :position, Integer, null: true
  field :title, String, null: true

  field :navigation_section, Types::CmsNavigationItemType, null: true
  field :page, Types::PageType, null: true

  association_loaders CmsNavigationItem, :navigation_section, :page
end
