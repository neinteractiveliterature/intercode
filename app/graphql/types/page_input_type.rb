# frozen_string_literal: true
class Types::PageInputType < Types::BaseInputObject
  argument :admin_notes, String, required: false, camelize: false
  argument :cms_layout_id, ID, required: false, camelize: true
  argument :content, String, required: false
  argument :hidden_from_search, Boolean, required: false, camelize: false
  argument :name, String, required: false
  argument :skip_clickwrap_agreement, Boolean, required: false, camelize: false
  argument :slug, String, required: false
end
