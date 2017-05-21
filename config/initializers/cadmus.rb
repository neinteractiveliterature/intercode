Cadmus.page_model = Page
Cadmus.partial_model = CmsPartial
CadmusFiles.file_model = "CmsFile"

Cadmus::Tags::PageUrl.define_page_path_method do |page_name, parent|
  page_path(page_name)
end