class Types::RootNavigationGroup < Types::BaseObject
  field :items, [Types::RootNavigationGroupItem], null: false
  field :expand, Boolean, null: false
end
