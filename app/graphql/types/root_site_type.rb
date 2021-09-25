class Types::RootSiteType < Types::BaseObject
  implements Types::CmsParent

  field :id, Int, null: false
  field :site_name, String, null: false, camelize: false
  field :host, String, null: false
  field :url, String, null: false

  def id
    0
  end
end
