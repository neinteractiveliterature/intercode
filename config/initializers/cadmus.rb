Cadmus.page_model = Page
Cadmus.partial_model = CmsPartial

Cadmus::Tags::PageUrl.define_page_path_method do |page_name, parent|
  page_path(page_name)
end