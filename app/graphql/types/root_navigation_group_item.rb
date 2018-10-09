class Types::RootNavigationGroupItem < Types::BaseUnion
  possible_types Types::NavigationItem,
    Types::NavigationSection,
    Types::TicketPurchaseNavigationItem,
    Types::UserNavigationSection

  def self.resolve_type(object, _context)
    case object
    when NavigationBarPresenter::NavigationItem then Types::NavigationItem
    when NavigationBarPresenter::UserNavigationSection then Types::UserNavigationSection
    when NavigationBarPresenter::NavigationSection then Types::NavigationSection
    when NavigationBarPresenter::TicketPurchaseNavigationItem
      Types::TicketPurchaseNavigationItem
    end
  end
end
