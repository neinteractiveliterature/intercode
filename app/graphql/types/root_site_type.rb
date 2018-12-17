class Types::RootSiteType < Types::BaseObject
  field :id, ID, null: false
  field :root_page, Types::PageType, null: false, camelize: false
  field :default_layout, Types::CmsLayoutType, null: false, camelize: false

  def id
    'singleton'
  end
end
