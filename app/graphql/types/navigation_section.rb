class Types::NavigationSection < Types::BaseObject
  field :label, String, null: false
  field :items, [Types::NavigationItem], null: false
end
