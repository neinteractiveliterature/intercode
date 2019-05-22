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

  def event_for_path
    return unless convention
    return @event_for_path if defined?(@event_for_path)

    @event_for_path = begin
      if convention.site_mode == 'single_event'
        convention.events.first
      elsif (match = (%r{\A/events/(\d+)}.match(request.path)))
        convention.events.active.find_by(id: match[1])
      end
    end
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
