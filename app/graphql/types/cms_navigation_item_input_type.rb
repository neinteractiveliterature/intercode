# frozen_string_literal: true
class Types::CmsNavigationItemInputType < Types::BaseInputObject
  argument :title, String, required: false
  argument :position, Integer, required: false
  argument :transitional_navigation_section_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the navigationSectionId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :navigation_section_id, ID, required: false, camelize: true
  argument :transitional_page_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the pageId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :page_id, ID, required: false, camelize: true
end
