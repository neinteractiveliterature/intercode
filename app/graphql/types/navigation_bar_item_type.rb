class Types::NavigationBarItemType < Types::BaseUnion
  possible_types Types::NavigationCollapseType,
    Types::NavigationBrandType

  def self.resolve_type(object, _context)
    case object
    when NavigationBarPresenter::NavigationCollapse then Types::NavigationCollapseType
    when NavigationBarPresenter::NavigationBrand then Types::NavigationBrandType
    end
  end
end
