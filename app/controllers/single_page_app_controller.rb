class SinglePageAppController < ApplicationController
  include CmsContentHelpers

  def root
    @page = current_cms_page(request.path)
    @event = event_for_path(request.path)
    @page_title = @page&.name

    render html: '', layout: 'application'
  end
end
