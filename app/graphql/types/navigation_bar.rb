class Types::NavigationBar < Types::BaseObject
  field :classes, String, null: false
  field :items, [Types::NavigationBarItem], null: false
end
