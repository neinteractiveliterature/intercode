# frozen_string_literal: true
class CmsRenderingContext
  include Cadmus::RenderingHelper
  include Cadmus::Renderable
  include ApplicationHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::AssetTagHelper
  attr_reader :cms_parent, :controller, :assigns, :cached_partials, :preloaded_partial_sources, :cached_files, :timezone

  def initialize(cms_parent:, controller:, timezone:, assigns: {})
    @cms_parent = cms_parent
    @controller = controller
    @assigns = assigns
    @timezone = timezone
    @cached_partials = {} # Liquid's cache of parsed partials
    @preloaded_partial_sources = {}
    @cached_files = {}
  end

  def convention
    return nil unless cms_parent.is_a?(Convention)
    cms_parent
  end

  def render_page_content(page)
    preload_page_content(page)
    cadmus_renderer.render(page.liquid_template, :html, assigns: { "page" => page })
  end

  def render_layout_content(cms_layout, assigns)
    preload_cms_layout_content(cms_layout)
    cadmus_renderer.render(cms_layout.liquid_template, :html, assigns: assigns)
  end

  def preload_page_content(*pages)
    page_ids = pages.map(&:id)
    preload_partial_sources(CmsPartial.joins(:pages).where(pages: { id: page_ids }))
    preload_files(CmsFile.joins(:pages).where(pages: { id: page_ids }))
  end

  def preload_cms_layout_content(cms_layout = nil)
    cms_layout ||= cms_parent&.default_layout
    return unless cms_layout

    preload_partial_sources(cms_layout.cms_partials)

    preload_files(cms_layout.cms_files)
  end

  def liquid_assigns_for_single_page_app(cms_layout)
    liquid_assigns.merge(
      "content_for_head" => "",
      "content_for_navbar" =>
        tag.div(
          "",
          "data-react-class" => "NavigationBar",
          "data-react-props" => {
            navbarClasses: cms_layout.navbar_classes || ApplicationHelper::DEFAULT_NAVBAR_CLASSES
          }.to_json
        ),
      "content_for_layout" =>
        tag.div(
          "",
          "data-react-class" => "AppRouter",
          "data-react-props" => { alert: controller&.flash&.alert }.to_json
        )
    )
  end

  def liquid_assigns_for_placeholder_template
    stylesheet_links = StaticSpaShell.stylesheet_hrefs.map { |href| tag.link(rel: "stylesheet", href: href) }
    liquid_assigns.merge(
      "content_for_head" => "#{stylesheet_links.join}{{ content_for_head }}",
      "content_for_navbar" => "{{ content_for_navbar }}",
      "content_for_layout" => "{{ content_for_layout }}"
    )
  end

  # These variables will automatically be made available to Cadmus CMS content.  For
  # example, you'll be able to do {% for convention in conventions %} in a page template.
  def liquid_assigns
    cms_variables.merge(
      "conventions" => -> { Convention.where(hidden: false).to_a },
      "organizations" => -> { Organization.all.to_a }
    ).merge(assigns)
  end

  # These variables aren't available from Cadmus CMS templates, but are available to
  # custom Liquid filters and tags via the Liquid::Context object.  Exposing the
  # controller is useful for generating URLs in templates.
  def liquid_registers
    liquid_assigns.merge(
      "controller" => controller,
      "parent" => cms_parent,
      :cached_partials => cached_partials,
      :cached_files => cached_files,
      :file_system => PreloadedPartialFileSystem.new(convention, preloaded_partial_sources),
      :timezone => timezone
    )
  end

  def cms_variables
    @cms_variables ||=
      cms_parent.cms_variables.pluck(:key, :value).each_with_object({}) { |(key, value), hash| hash[key] = value }
  end

  private

  # The {% file_url %} tag looks files up by name as a String, so don't key these by ActiveStorage::Filename
  def preload_files(cms_files)
    cached_files.update(cms_files.includes(file_attachment: :blob).index_by { |cms_file| cms_file.file.filename.to_s })
  end

  def preload_partial_sources(partials)
    preloaded_partial_sources.update(partials.to_h { |partial| [partial.name, partial.content.to_s] })
  end
end
# rubocop:enable Metrics/ClassLength
