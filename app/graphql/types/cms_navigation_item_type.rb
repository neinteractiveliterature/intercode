Types::CmsNavigationItemType = GraphQL::ObjectType.define do
  name 'CmsNavigationItem'

  field :id, !types.Int
  field :position, types.Int
  field :title, types.String

  field :navigation_section, Types::CmsNavigationItemType do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(CmsNavigationItem, :navigation_section).load(obj)
    }
  end

  field :navigation_items, types[Types::CmsNavigationItemType] do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(CmsNavigationItem, :navigation_items).load(obj)
    }
  end

  field :page, Types::PageType do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(CmsNavigationItem, :page).load(obj)
    }
  end
end
