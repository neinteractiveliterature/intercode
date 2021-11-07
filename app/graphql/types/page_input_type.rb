# frozen_string_literal: true
class Types::PageInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :slug, String, required: false
  argument :content, String, required: false
  argument :admin_notes, String, required: false, camelize: false
  argument :transitional_cms_layout_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the cmsLayoutId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :cms_layout_id, ID, required: false, camelize: true
  argument :skip_clickwrap_agreement, Boolean, required: false, camelize: false
  argument :hidden_from_search, Boolean, required: false, camelize: false
end
