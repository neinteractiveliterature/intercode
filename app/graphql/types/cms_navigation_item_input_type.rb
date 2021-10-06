# frozen_string_literal: true
class Types::CmsNavigationItemInputType < Types::BaseInputObject
  argument :title, String, required: false
  argument :position, Integer, required: false
  argument :navigation_section_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_navigation_section_id, ID, required: false, camelize: true
  argument :page_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_page_id, ID, required: false, camelize: true
end
