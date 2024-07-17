# frozen_string_literal: true
class Types::CmsNavigationItemInputType < Types::BaseInputObject
  argument :navigation_section_id, ID, required: false, camelize: true
  argument :page_id, ID, required: false, camelize: true
  argument :position, Integer, required: false
  argument :title, String, required: false
end
