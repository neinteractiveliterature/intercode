class ClearCmsContentService < ApplicationService
  attr_reader :convention

  def initialize(convention:)
    @convention = convention
  end

  private

  def inner_call
    convention.update!(root_page: nil)
    convention.pages.destroy_all
    convention.cms_partials.destroy_all

    success
  end
end