# frozen_string_literal: true
module ApplicationHelper
  DEFAULT_NAVBAR_CLASSES = "navbar-fixed-top navbar-expand-md mb-4 navbar-dark bg-intercode-blue"

  def self.obfuscated_email(address)
    address.gsub(".", " DOT ").gsub("@", " AT ")
  end

  def page_title
    parts = []

    parts << @page_title if @page_title.present?
    parts << @event.title if @event

    parts << (@convention ? @convention.name : "Intercode")

    parts.join(" - ")
  end

  def open_graph_description_for_page(page)
    page.meta_description.presence || page.cached_og_description
  end

  def application_entry_path
    Rails.env.development? ? "/app/javascript/packs/applicationEntry.ts" : "/packs/application.js"
  end

  def url_with_possible_host(path, host)
    return path if host.blank?

    "#{request.scheme}://#{host}#{path}"
  end

  def app_root_loading_content
    visually_hidden_style =
      "position:absolute;width:1px;height:1px;padding:0;margin:-1px;" \
        "overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"
    spinner_style =
      "display:inline-block;width:2rem;height:2rem;border:0.25em solid currentColor;" \
        "border-right-color:transparent;border-radius:50%;animation:_intercode_spinner 0.75s linear infinite"

    tag.style("@keyframes _intercode_spinner{to{transform:rotate(360deg)}}") +
      tag.div(
        tag.div(tag.span("Loading...", style: visually_hidden_style), role: "status", style: spinner_style),
        style: "text-align:center;margin-top:3rem"
      )
  end

  def browser_warning
    # CloudFront strips all cookies before forwarding to the origin, so the
    # suppressBrowserWarning cookie is never visible to Rails on proxied requests.
    # The warning also can't be dismissed there. Skip it entirely.
    return nil if request.headers["Via"].to_s.include?("CloudFront")
    return nil if request.cookies["suppressBrowserWarning"] == "true"

    presenter = BrowserWarningPresenter.new(request.user_agent)
    return nil if presenter.supported?

    presenter.render
  end
end
