# frozen_string_literal: true
class Types::PermissionedModelType < Types::BaseUnion
  possible_types Types::CmsContentGroupType, Types::ConventionType, Types::EventCategoryType

  def self.resolve_type(object, _context)
    case object
    when CmsContentGroup
      Types::CmsContentGroupType
    when Convention
      Types::ConventionType
    when EventCategory
      Types::EventCategoryType
    end
  end
end
