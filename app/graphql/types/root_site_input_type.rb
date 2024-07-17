# frozen_string_literal: true
class Types::RootSiteInputType < Types::BaseInputObject
  argument :default_layout_id, ID, required: false, camelize: true
  argument :root_page_id, ID, required: false, camelize: true
  argument :site_name, String, required: false, camelize: false
end
