# frozen_string_literal: true
class ClearCmsContentService < CivilService::Service
  attr_reader :convention

  def initialize(convention:)
    @convention = convention
  end

  private

  def inner_call
    cms_parent.update!(root_page: nil, default_layout: nil, user_con_profile_form: nil)
    cms_parent.cms_navigation_items.destroy_all
    cms_parent.pages.destroy_all
    cms_parent.cms_partials.destroy_all
    cms_parent.cms_layouts.destroy_all
    cms_parent.cms_files.destroy_all
    cms_parent.forms.destroy_all

    success
  end

  def cms_parent
    @cms_parent ||= convention || RootSite.instance
  end
end
