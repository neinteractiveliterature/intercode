# frozen_string_literal: true
class Types::RootSiteInputType < Types::BaseInputObject
  argument :site_name, String, required: false, camelize: false
  argument :root_page_id, ID, required: false, camelize: true
  argument :default_layout_id, ID, required: false, camelize: true
end
