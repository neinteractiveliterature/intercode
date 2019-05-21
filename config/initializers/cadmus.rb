Cadmus.page_model = 'Page'
Cadmus.partial_model = 'CmsPartial'
Cadmus.layout_model = 'CmsLayout'
CadmusFiles.file_model = 'CmsFile'
CadmusNavbar.navigation_item_model = 'CmsNavigationItem'

Cadmus::Tags::PageUrl.define_page_path_method do |page_name, _parent|
  "/pages/#{page_name}"
end
