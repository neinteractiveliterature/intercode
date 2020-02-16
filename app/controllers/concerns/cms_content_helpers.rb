module CmsContentHelpers
  extend ActiveSupport::Concern

  protected

  def cms_content_finder
    @cms_content_finder ||= CmsContentFinder.new(convention)
  end

  delegate :cms_parent, :current_cms_page, :effective_cms_layout, :event_for_path,
    to: :cms_content_finder

  def cms_rendering_context(path: nil)
    effective_path = path || request.path
    cms_content_finder.cms_rendering_context(
      path: effective_path,
      controller: self,
      user: current_user,
      user_con_profile: user_con_profile
    )
  end
end
