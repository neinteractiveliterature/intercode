module BioHelper
  include ActionView::Helpers::SanitizeHelper
  include ActionView::Helpers::TextHelper

  def format_bio(bio)
    sanitized_bio = sanitize(bio, tags: %w(strong b em i a hr table thead tbody tr td th), attributes: %w(href))
    if sanitized_bio.present?
      simple_format(sanitized_bio, sanitize: false)
    else
      content_tag(:em, "No bio provided")
    end
  end
end