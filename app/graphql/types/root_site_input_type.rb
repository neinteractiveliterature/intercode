# frozen_string_literal: true
class Types::RootSiteInputType < Types::BaseInputObject
  argument :site_name, String, required: false, camelize: false
  argument :transitional_root_page_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the rootPageId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :root_page_id, ID, required: false, camelize: true
  argument :transitional_default_layout_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the defaultLayoutId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :default_layout_id, ID, required: false, camelize: true
end
