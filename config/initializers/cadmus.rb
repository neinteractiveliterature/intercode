Cadmus.page_model = 'Page'
Cadmus.partial_model = 'CmsPartial'
Cadmus.layout_model = 'CmsLayout'
CadmusNavbar.navigation_item_model = 'CmsNavigationItem'

Cadmus::Tags::PageUrl.define_page_path_method { |page_name, _parent| "/pages/#{page_name}" }
