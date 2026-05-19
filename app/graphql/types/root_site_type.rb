# frozen_string_literal: true
class Types::RootSiteType < Types::BaseObject
  description "The root site, which hosts global CMS content and authentication pages."

  implements Types::CmsParent
  include CmsParentImplementation

  field :auth_layout, Types::CmsLayoutType, null: true, description: "CMS layout used for authentication pages."
  field :host, String, null: false, description: "The hostname of the root site."
  field :id, ID, null: false, description: "A fixed identifier for the singleton root site."
  field :site_name, String, null: false, camelize: false, description: "The display name shown in the navigation bar."
  field :url, String, null: false, description: "The base URL of the root site."

  def id
    "singleton"
  end
end
