class MarkdownPresenter
  ALLOWED_LIQUID_NODE_CLASSES = [
    String, Intercode::Liquid::Tags::Spoiler, Intercode::Liquid::Tags::Youtube
  ]

  include ActionView::Helpers::SanitizeHelper
  include ActionView::Helpers::TextHelper

  def self.markdown_processor
    @markdown_processor ||= Redcarpet::Markdown.new(
      Redcarpet::Render::HTML.new(link_attributes: { target: '_blank', rel: 'noreferrer' }),
      no_intra_emphasis: true,
      autolink: true
    )
  end

  def self.strip_single_p(html)
    fragment = Nokogiri::HTML::DocumentFragment.parse(html)
    non_blank_children = fragment.children.reject { |child| child.text? && child.content.blank? }

    if non_blank_children.size == 1 && non_blank_children.first.name == 'p'
      non_blank_children.first.inner_html.html_safe
    else
      html
    end
  end

  attr_reader :default_content, :cadmus_renderer

  def initialize(default_content, cadmus_renderer: nil)
    @default_content = default_content
    @cadmus_renderer = cadmus_renderer
  end

  def render(markdown, sanitize_content: true, strip_single_p: true, whitelist_liquid_tags: true)
    pipeline = build_pipeline(
      sanitize_content: sanitize_content,
      strip_single_p: strip_single_p,
      whitelist_liquid_tags: whitelist_liquid_tags
    )

    pipeline.inject(markdown) { |acc, elem| elem.call(acc) }
  end

  private

  def build_pipeline(sanitize_content:, strip_single_p:, whitelist_liquid_tags:)
    pipeline = []
    liquid_renderer = (
      ->(content) { render_liquid(content, whitelist_liquid_tags: whitelist_liquid_tags) }
    )
    markdown_renderer = (
      ->(content) { MarkdownPresenter.markdown_processor.render(content || '') }
    )
    sanitizer = (
      ->(content) { sanitize_html(content, sanitize_content: sanitize_content) }
    )

    pipeline << liquid_renderer unless sanitize_content
    pipeline << markdown_renderer
    pipeline << sanitizer
    pipeline << liquid_renderer if sanitize_content
    pipeline << ->(content) {
      content.presence || (default_content.present? ? "<p><em>#{default_content}</em></p>" : '')
    }
    pipeline << ->(content) { MarkdownPresenter.strip_single_p(content) } if strip_single_p

    pipeline
  end

  def sanitize_html(html, sanitize_content: true)
    if sanitize_content
      # Loofah will automatically sanitize CSS for us
      sanitize(html, attributes: Rails::Html::SafeListSanitizer.allowed_attributes + ['style'])
    else
      sanitize(html, scrubber: Rails::Html::TargetScrubber.new) # target nothing for removal
    end
  end

  def render_liquid(liquid, whitelist_liquid_tags: true)
    template = Liquid::Template.parse(liquid)

    if whitelist_liquid_tags
      template.root.nodelist.select! do |node|
        ALLOWED_LIQUID_NODE_CLASSES.any? { |klass| node.is_a?(klass) }
      end
    end

    if cadmus_renderer
      cadmus_renderer.render(template, :html)
    else
      template.render.html_safe
    end
  rescue StandardError => e
    %(<div class="alert alert-danger">#{e.message}</div>\n#{liquid}).html_safe
  end
end
