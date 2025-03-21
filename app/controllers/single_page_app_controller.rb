# frozen_string_literal: true
class SinglePageAppController < ApplicationController
  include CmsContentHelpers

  def root
    @page = current_cms_page(request.path)
    @event = event_for_path(request.path)
    @page_title = @page&.name
    @include_application_entry = true

    render html: "", layout: "application"
  end
end
