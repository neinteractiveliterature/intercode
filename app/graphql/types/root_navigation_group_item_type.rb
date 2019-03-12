class Types::RootNavigationGroupItemType < Types::BaseUnion
  possible_types Types::NavigationItemType,
    Types::NavigationSectionType,
    Types::TicketPurchaseNavigationItemType,
    Types::UserNavigationSectionType

  def self.resolve_type(object, _context)
    case object
    when NavigationBarPresenter::NavigationItem then Types::NavigationItemType
    when NavigationBarPresenter::UserNavigationSection then Types::UserNavigationSectionType
    when NavigationBarPresenter::NavigationSection then Types::NavigationSectionType
    when NavigationBarPresenter::TicketPurchaseNavigationItemType
      Types::TicketPurchaseNavigationItemType
    end
  end
end
