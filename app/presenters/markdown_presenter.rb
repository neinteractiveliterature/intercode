class MarkdownPresenter
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

    if sanitize
      sanitized_html = sanitize(
        rendered_html,
        tags: %w(strong b em i a hr table thead tbody tr td th p br img center small h1 h2 h3 h4 h5 h6 ol ul li sup sub pre code),
        attributes: %w(href src alt)
      )
    else
      sanitized_html = sanitize(rendered_html, scrubber: Rails::Html::TargetScrubber.new) # target nothing for removal
    end

    sanitized_html.presence || "<p><em>#{default_content}</em></p>"
  end
end