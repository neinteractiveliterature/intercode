class Types::RootNavigationGroupType < Types::BaseObject
  field :items, [Types::RootNavigationGroupItemType], null: false
  field :expand, Boolean, null: false
end
