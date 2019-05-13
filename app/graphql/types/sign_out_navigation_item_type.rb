class Types::SignOutNavigationItemType < Types::BaseObject
  field :label, String, null: false
  field :visible, Boolean, null: false

  def visible
    object.visible?
  end
end
