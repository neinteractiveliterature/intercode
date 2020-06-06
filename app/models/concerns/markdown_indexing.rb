module MarkdownIndexing
  extend ActiveSupport::Concern

  def self.indexable_markdown(content)
    # this is essentially a reimplementation of ActionView::Helpers::SanitizeHelper#strip_tags
    MarkdownIndexing.full_sanitizer.sanitize(MarkdownPresenter.new('').render(content)).strip
  rescue => e
    Rails.logger.debug e
    ''
  end

  def self.full_sanitizer
    @full_sanitizer ||= Rails::Html::Sanitizer.full_sanitizer.new
  end

  class_methods do
    def indexable_markdown_field(field, &reader)
      define_method(field) do
        MarkdownIndexing.indexable_markdown(instance_eval(&reader))
      end
    end
  end
end
