# frozen_string_literal: true
class ClearCmsContentService < CivilService::Service
  attr_reader :convention

  def initialize(convention:)
    @convention = convention
  end

  private

  def inner_call
    convention.update!(root_page: nil, default_layout: nil, user_con_profile_form: nil)
    convention.cms_navigation_items.destroy_all
    convention.pages.destroy_all
    convention.cms_partials.destroy_all
    convention.cms_layouts.destroy_all
    convention.cms_files.destroy_all
    convention.forms.destroy_all

    success
  end
end
