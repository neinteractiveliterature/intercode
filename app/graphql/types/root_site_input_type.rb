# frozen_string_literal: true
class Types::RootSiteInputType < Types::BaseInputObject
  argument :site_name, String, required: false, camelize: false
  argument :root_page_id, Int, required: false, camelize: false
  argument :default_layout_id, Int, required: false, camelize: false
end
