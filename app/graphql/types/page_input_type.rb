class Types::PageInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :slug, String, required: false
  argument :content, String, required: false
  argument :admin_notes, String, required: false, camelize: false
  argument :cms_layout_id, Integer, required: false, camelize: false
  argument :skip_clickwrap_agreement, Boolean, required: false, camelize: false
  argument :hidden_from_search, Boolean, required: false, camelize: false
end
