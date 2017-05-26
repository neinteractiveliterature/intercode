module BioHelper
  include ActionView::Helpers::SanitizeHelper
  include ActionView::Helpers::TextHelper

  def self.markdown_processor
    @markdown_processor ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML.new, no_intra_emphasis: true, autolink: true)
  end

  def format_bio(bio)
    rendered_bio = BioHelper.markdown_processor.render(bio || '')
    sanitized_bio = sanitize(rendered_bio, tags: %w(strong b em i a hr table thead tbody tr td th p br), attributes: %w(href))

    sanitized_bio.presence || "<p><em>No bio provided</em></p>"
  end
end