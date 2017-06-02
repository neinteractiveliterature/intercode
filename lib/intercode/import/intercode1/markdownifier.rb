require 'reverse_markdown'

class Intercode::Import::Intercode1::Markdownifier
  attr_reader :logger

  def initialize(logger)
    @logger = logger
  end

  def markdownify(html)
    return nil unless html.present?

    cleaned_html = nil
    begin
      cleaned_html = Nokogiri::HTML::DocumentFragment.parse(html).to_html
    rescue Exception => e
      logger.warn("Error parsing HTML #{html.inspect}: #{e.message}")
      return html
    end

    begin
      ReverseMarkdown.convert(cleaned_html)
    rescue Exception => e
      logger.warn("Error converting #{cleaned_html.inspect} to Markdown: #{e.message}")
      cleaned_html
    end
  end
end