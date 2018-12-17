class Types::RootSiteInputType < Types::BaseInputObject
  argument :root_page_id, Int, required: false, camelize: false
  argument :default_layout_id, Int, required: false, camelize: false
end
