class Types::RootSiteType < Types::BaseObject
  field :id, Int, null: false
  field :site_name, String, null: false, camelize: false
  field :root_page, Types::PageType, null: false, camelize: false
  field :default_layout, Types::CmsLayoutType, null: true, camelize: false
  field :host, String, null: false
  field :url, String, null: false

  def id
    0
  end
end
