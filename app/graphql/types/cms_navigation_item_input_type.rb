# frozen_string_literal: true
class Types::CmsNavigationItemInputType < Types::BaseInputObject
  argument :title, String, required: false
  argument :position, Integer, required: false
  argument :navigation_section_id, ID, required: false, camelize: true
  argument :page_id, ID, required: false, camelize: true
end
