class Types::CmsNavigationItemInputType < Types::BaseInputObject
  argument :title, String, required: false
  argument :position, Integer, required: false
  argument :navigation_section_id, Integer, required: false, camelize: false
  argument :page_id, Integer, required: false, camelize: false
end
