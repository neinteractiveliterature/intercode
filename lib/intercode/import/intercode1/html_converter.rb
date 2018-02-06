class Intercode::Import::Intercode1::HtmlConverter
  include Intercode::Import::Intercode1::UploadFile

  attr_reader :html, :convention, :file_root

  def initialize(html:, convention:, file_root:)
    @html = html
    @convention = convention
    @file_root = file_root
  end

  def convert
    doc = Nokogiri::HTML::DocumentFragment.parse(html, 'UTF-8')

    # Try to fix up internal links to other CMS pages
    doc.css('a[href]').each do |link|
      if link['href'] =~ /\.pdf\z/
        cms_file = upload_url(link['href'])
        link['href'] = "__CMS_FILE_URL_#{cms_file.file.filename}" if cms_file
      else
        link['href'] = intercode2_path_for_link(link['href'])
      end
    end

    # Fix the weird bad iframe href on the con com meetings page
    doc.css('iframe').each do |iframe|
      iframe['src'] = iframe['src'].gsub("\r\n", '')
    end

    # Find and upload images
    doc.css('img').each do |img|
      cms_file = upload_url(img['src'])
      img['src'] = "__CMS_FILE_URL_#{cms_file.file.filename}" if cms_file
    end

    # Add spacing classes to emulate old header behavior
    doc.css('h1, h2, h3').each do |header|
      header['class'] = [header['class'], 'my-3'].compact.join(' ')
    end
    doc.css('h4, h5, h6').each do |header|
      header['class'] = [header['class'], 'my-2'].compact.join(' ')
    end

    # Nokogiri will escape "{% page_url something_or_other %}" in a href tag, so we temporarily set
    # the href to __PAGE_URL_something_or_other and then post-process it to Liquid here.
    doc.to_s.gsub(
      /__PAGE_URL_(\w+)/,
      '{% page_url \1 %}'
    ).gsub(
      /__CMS_FILE_URL_([^\"]+)/,
      '{% file_url "\1" %}'
    )
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def intercode2_path_for_link(url)
    case url
    when /\A\\\"(.*)\\\"\z/
      # Some URLs are improperly escaped/quoted in the Intercode 1 content set.  Let's go above and
      # beyond the call of duty and fix them.
      intercode2_path_for_link(Regexp.last_match(1))
    when /ConComSchedule\.php/
      '__PAGE_URL_con_com_schedule'
    when /[Ss]tatic\.php\?page=(\w+)/
      "__PAGE_URL_#{Cadmus::Slugs.slugify(Regexp.last_match(1))}"
    else
      parsed_url = URI.parse(url)
      logger.warn("Unknown URL: #{url}") if parsed_url.scheme.blank? && parsed_url.path.present?
      url
    end
  end

  def upload_url(url)
    parsed_url = URI.parse(url)
    # don't change it if it's a local file in the source tree
    return unless parsed_url.scheme.blank? && parsed_url.path.present?

    upload_file(convention, File.expand_path(url, file_root))
  end
end
