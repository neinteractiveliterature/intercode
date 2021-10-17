# frozen_string_literal: true
class Types::CmsContentType < Types::BaseUnion
  possible_types Types::PageType, Types::CmsPartialType, Types::CmsLayoutType

  def self.resolve_type(object, _context)
    case object
    when Page
      Types::PageType
    when CmsPartial
      Types::CmsPartialType
    when CmsLayout
      Types::CmsLayoutType
    end
  end
end
