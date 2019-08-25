class Types::CmsContentType < Types::BaseUnion
  possible_types Types::PageType, Types::CmsPartialType, Types::CmsLayoutType

  def self.resolve_type(object, _context)
    case object
    when Page then Types::PageType
    when CmsPartial then Types::CmsPartialType
    when CmsLayout then Types::CmsLayoutType
    end
  end
end
