# frozen_string_literal: true
class Types::RootSiteType < Types::BaseObject
  implements Types::CmsParent
  include CmsParentImplementation

  field :id, ID, null: false
  field :site_name, String, null: false, camelize: false
  field :host, String, null: false
  field :url, String, null: false

  def id
    'singleton'
  end
end
