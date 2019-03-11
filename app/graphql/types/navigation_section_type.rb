class Types::NavigationSectionType < Types::BaseObject
  field :label, String, null: false
  field :items, [Types::NavigationItemType], null: false
end
