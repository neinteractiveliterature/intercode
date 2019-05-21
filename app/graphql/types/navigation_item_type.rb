class Types::NavigationItemType < Types::BaseObject
  field :label, String, null: false
  field :url, String, null: true
  field :visible, Boolean, null: false

  def visible
    object.visible?
  end
end
