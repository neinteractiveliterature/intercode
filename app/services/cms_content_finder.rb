# frozen_string_literal: true
class CmsContentFinder
  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  def cms_parent
    convention || RootSite.instance
  end

  def current_cms_page(path)
    if (match = %r{\A/pages/(.*)}.match(path))
      cms_parent.pages.find_by(slug: match[1])
    elsif path == "/"
      cms_parent.root_page
    end
  end

  def effective_cms_layout(path)
    current_cms_page(path)&.cms_layout || auth_cms_layout(path) || cms_parent.default_layout
  end

  def auth_cms_layout(path)
    return unless cms_parent.is_a?(RootSite)
    return unless path.start_with?("/users/", "/oauth/authorize")
    cms_parent.auth_layout
  end

  def event_for_path(path)
    return unless convention

    if convention.site_mode == "single_event"
      convention.events.first
    elsif (match = %r{\A/events/(\d+)}.match(path))
      convention.events.active.find_by(id: match[1])
    end
  end

  def cms_rendering_context(path: nil, controller: nil, user: nil, user_con_profile: nil, timezone: nil)
    @cms_rendering_contexts_by_path = {}
    @cms_rendering_contexts_by_path[path] ||= CmsRenderingContext.new(
      cms_parent: convention || RootSite.instance,
      controller:,
      timezone:,
      assigns: {
        "user" => user,
        "convention" => convention,
        "user_con_profile" => user_con_profile,
        "event" => event_for_path(path)
      }
    )
  end
end
