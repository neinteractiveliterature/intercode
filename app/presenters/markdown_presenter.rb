class MarkdownPresenter
  ALLOWED_LIQUID_NODE_CLASSES = [String, Intercode::Liquid::Tags::Youtube]

  include ActionView::Helpers::SanitizeHelper
  include ActionView::Helpers::TextHelper

  def self.markdown_processor
    @markdown_processor ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML.new, no_intra_emphasis: true, autolink: true)
  end

  attr_reader :default_content

  def initialize(default_content)
    @default_content = default_content
  end

  def render(markdown, sanitize: true)
    rendered_html = MarkdownPresenter.markdown_processor.render(markdown || '')
    sanitized_html = sanitize(rendered_html, sanitize: sanitize)

    content = sanitized_html.presence || "<p><em>#{default_content}</em></p>"
    render_liquid(content)
  end

  private
  def sanitize_html(html, sanitize: true)
    if sanitize
      sanitize(
        rendered_html,
        tags: %w(strong b em i a hr table thead tbody tr td th p br img center small h1 h2 h3 h4 h5 h6 ol ul li sup sub pre code),
        attributes: %w(href src alt)
      )
    else
      sanitize(rendered_html, scrubber: Rails::Html::TargetScrubber.new) # target nothing for removal
    end
  end

  def render_liquid(liquid)
    begin
      template = Liquid::Template.parse(liquid)
      template.root.nodelist.select! do |node|
        ALLOWED_LIQUID_NODE_CLASSES.any? { |klass| node.is_a?(klass) }
      end
      template.render.html_safe
    rescue Exception => e
      %{<div class="alert alert-danger">#{e.message}</div>\n#{liquid}}.html_safe
    end
  end
end