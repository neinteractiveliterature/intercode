class Intercode::Import::Markdownifier
  attr_reader :logger

  def initialize(logger)
    @logger = logger
  end

  def markdownify(html)
    return nil unless html.present?

    parsed_html = nil
    begin
      parsed_html = Nokogiri::HTML::DocumentFragment.parse(html)
    rescue StandardError => e
      logger.warn("Error parsing HTML #{html.inspect}: #{e.message}")
      return html
    end

    convert_youtube_links(parsed_html)

    cleaned_html = parsed_html.to_html

    begin
      require "reverse_markdown"
      ReverseMarkdown.convert(cleaned_html)
    rescue StandardError => e
      logger.warn("Error converting #{cleaned_html.inspect} to Markdown: #{e.message}")
      cleaned_html
    end
  end

  private

  # destructively edits a Nokogiri tree!
  def convert_youtube_links(parsed_html)
    parsed_html
      .css("object > param[name=movie][value*=youtube]")
      .each do |movie_param|
        m = %r{www\.youtube\.com\/v\/([A-Za-z0-9_-]+)}.match(movie_param["value"])
        movie_param.parent.add_previous_sibling("{% youtube #{m[1]} %}")
        movie_param.parent.remove
      end
  end
end
