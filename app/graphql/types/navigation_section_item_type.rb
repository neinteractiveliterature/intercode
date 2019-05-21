class Types::NavigationSectionItemType < Types::BaseUnion
  possible_types Types::SignOutNavigationItemType,
    Types::NavigationItemType

  def self.resolve_type(object, _context)
    case object
    when NavigationBarPresenter::SignOutNavigationItem then Types::SignOutNavigationItemType
    when NavigationBarPresenter::NavigationItem then Types::NavigationItemType
    end
  end
end
