class Types::NavigationItemType < Types::BaseObject
  field :label, String, null: false
  field :url, String, null: false
  field :visible, Boolean, null: false
  field :http_method, String, null: false, camelize: false

  def visible
    object.visible?
  end
end
