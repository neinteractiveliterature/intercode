class ClearCmsContentService < ApplicationService
  attr_reader :convention

  def initialize(convention:)
    @convention = convention
  end

  private

  def inner_call
    convention.update!(root_page: nil, default_layout: nil)
    convention.cms_navigation_items.destroy_all
    convention.pages.destroy_all
    convention.cms_partials.destroy_all
    convention.cms_layouts.destroy_all

    success
  end
end
