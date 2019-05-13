class Types::NavigationSectionType < Types::BaseObject
  field :label, String, null: false
  field :items, [Types::NavigationSectionItemType], null: false
end
