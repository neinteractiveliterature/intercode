# frozen_string_literal: true
class Types::RootSiteInputType < Types::BaseInputObject
  description "Input type for updating root site settings."

  argument :auth_layout_id,
           ID,
           required: false,
           camelize: true,
           description: "ID of the CMS layout to use for authentication pages."
  argument :default_layout_id,
           ID,
           required: false,
           camelize: true,
           description: "ID of the default CMS layout for pages."
  argument :root_page_id, ID, required: false, camelize: true, description: "ID of the root page."
  argument :site_name,
           String,
           required: false,
           camelize: false,
           description: "Display name shown in the navigation bar."
end
