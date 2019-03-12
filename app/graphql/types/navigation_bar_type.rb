class Types::NavigationBarType < Types::BaseObject
  field :classes, String, null: false
  field :items, [Types::NavigationBarItemType], null: false
end
