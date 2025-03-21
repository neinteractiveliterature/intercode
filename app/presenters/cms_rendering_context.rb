# frozen_string_literal: true
class CmsRenderingContext
  include Cadmus::RenderingHelper
  include Cadmus::Renderable
  include ApplicationHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::AssetTagHelper
  attr_reader :cms_parent, :controller, :assigns, :cached_partials, :cached_files, :timezone
  # delegate :request, to: :controller

  NOSCRIPT_WARNING = <<~HTML.html_safe
  <noscript id="no-javascript-warning">
    <div class="container">
      <div class="alert alert-danger">
        <h2 class="mb-4">JavaScript disabled</h2>

        <div class="d-flex align-items-center">
          <h1 class="m-0 me-4">
            <i class="bi-exclamation-triangle-fill"></i>
          </h1>
          <div class="flex-grow-1">
            <p>
              Your web browser has JavaScript disabled.  This site is written mostly in JavaScript,
              and will not work without it.  Please enable JavaScript in your browser's settings (or
              disable your JavaScript-blocking browser extension for this site).
            </p>
          </div>
        </div>

        <div class="text-end">
          <a class="btn btn-primary" href=".">Reload page</a>
        </div>
      </div>
    </div>
  </noscript>
  HTML

  def initialize(cms_parent:, controller:, timezone:, assigns: {})
    @cms_parent = cms_parent
    @controller = controller
    @assigns = assigns
    @timezone = timezone
    @cached_partials = {}
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

  # We do this so that the doc that gets rendered will end up with the right stuff in <head>, but
  # not have its body content duplicated
  def render_app_root_content(cms_layout, assigns)
    layout_doc = Nokogiri::HTML.parse(render_layout_content(cms_layout, assigns))
    layout_head = layout_doc.xpath("//head").to_s

    graphql_presend_presenter = GraphqlPresendPresenter.new(controller: controller, cms_parent: cms_parent)
    doc = Nokogiri::HTML.parse("<!DOCTYPE html><html><head>#{layout_head}</head><body></body></html>")
    doc.xpath("//body/*").remove
    doc.xpath("//body").first.inner_html =
      tag.div(
        "",
        "data-react-class" => "AppRoot",
        "data-react-props" =>
          (controller&.app_component_props || {}).merge(
            { queryData: graphql_presend_presenter.graphql_presend_data }
          ).to_json
      )
    doc.to_s.html_safe
  rescue StandardError => e
    ErrorReporting.warn(e)
    Rails.logger.warn e
    render_layout_content(cms_layout, liquid_assigns_for_single_page_app(cms_layout).merge(assigns))
  end

  def preload_page_content(*pages)
    page_ids = pages.map(&:id)
    cached_partials.update(
      CmsPartial.joins(:pages).where(pages: { id: page_ids }).index_by(&:name).transform_values(&:liquid_template)
    )
    cached_files.update(
      CmsFile
        .joins(:pages)
        .where(pages: { id: page_ids })
        .includes(file_attachment: :blob)
        .index_by { |cms_file| cms_file.file.filename }
    )
  end

  def preload_cms_layout_content(cms_layout = nil)
    cms_layout ||= cms_parent&.default_layout
    return unless cms_layout

    cached_partials.update(cms_layout.cms_partials.index_by(&:name).transform_values(&:liquid_template))

    cached_files.update(
      cms_layout.cms_files.includes(file_attachment: :blob).index_by { |cms_file| cms_file.file.filename }
    )
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
    styles_url = url_with_possible_host("/packs/application-styles.js", ENV.fetch("ASSETS_HOST", nil))
    liquid_assigns.merge(
      "content_for_head" => "#{javascript_include_tag styles_url, type: "module"}{{ content_for_head }}",
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
      :file_system => Cadmus::PartialFileSystem.new(convention),
      :timezone => timezone
    )
  end

  def cms_variables
    @cms_variables ||=
      cms_parent.cms_variables.pluck(:key, :value).each_with_object({}) { |(key, value), hash| hash[key] = value }
  end
end
