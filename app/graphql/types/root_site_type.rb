# frozen_string_literal: true
class Types::RootSiteType < Types::BaseObject
  implements Types::CmsParent

  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :site_name, String, null: false, camelize: false
  field :host, String, null: false
  field :url, String, null: false

  def id
    0
  end
end
