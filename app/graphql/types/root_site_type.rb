# frozen_string_literal: true
class Types::RootSiteType < Types::BaseObject
  implements Types::CmsParent
  include CmsParentImplementation

  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :site_name, String, null: false, camelize: false
  field :host, String, null: false
  field :url, String, null: false

  def id
    0
  end

  def transitional_id
    'singleton'
  end
end
