# frozen_string_literal: true
class Types::PageInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :slug, String, required: false
  argument :content, String, required: false
  argument :admin_notes, String, required: false, camelize: false
  argument :cms_layout_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_cms_layout_id, ID, required: false, camelize: true
  argument :skip_clickwrap_agreement, Boolean, required: false, camelize: false
  argument :hidden_from_search, Boolean, required: false, camelize: false
end
