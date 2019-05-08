class Types::CmsParentType < Types::BaseUnion
  possible_types Types::ConventionType, Types::RootSiteType

  def self.resolve_type(object, _context)
    case object
    when Convention then Types::ConventionType
    when RootSite then Types::RootSiteType
    end
  end
end
