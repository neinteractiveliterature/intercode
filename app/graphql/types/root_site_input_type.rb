# frozen_string_literal: true
class Types::RootSiteInputType < Types::BaseInputObject
  argument :site_name, String, required: false, camelize: false
  argument :root_page_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_root_page_id, ID, required: false, camelize: true
  argument :default_layout_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_default_layout_id, ID, required: false, camelize: true
end
