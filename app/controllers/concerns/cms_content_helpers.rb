module Concerns::CmsContentHelpers
  extend ActiveSupport::Concern

  protected

  def cms_parent
    convention || RootSite.instance
  end

  def current_cms_page(path)
    if (match = (%r{\A/pages/(.*)}.match(path)))
      cms_parent.pages.find_by(slug: match[1])
    elsif path == '/'
      cms_parent.root_page
    end
  end

  def effective_cms_layout(path)
    current_cms_page(path)&.cms_layout || cms_parent.default_layout
  end

  def cms_rendering_context
    @cms_rendering_context ||= CmsRenderingContext.new(
      cms_parent: convention || RootSite.instance,
      controller: self,
      assigns: {
        'user' => current_user,
        'convention' => convention,
        'user_con_profile' => user_con_profile,
        'event' => event_for_path
      }
    )
  end
end
