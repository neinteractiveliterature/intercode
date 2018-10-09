class Types::NavigationBarItem < Types::BaseUnion
  possible_types Types::NavigationCollapse,
    Types::NavigationBrand

  def self.resolve_type(object, _context)
    case object
    when NavigationBarPresenter::NavigationCollapse then Types::NavigationCollapse
    when NavigationBarPresenter::NavigationBrand then Types::NavigationBrand
    end
  end
end
