class Intercode::Import::Intercode1::HtmlConverter
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
        cms_file = upload_file(link['href'])
        if cms_file
          link['href'] = "__CMS_FILE_URL_#{cms_file.file.filename}"
        end
      else
        link['href'] = intercode2_path_for_link(link['href'])
      end
    end

    # Find and upload images
    doc.css('img').each do |img|
      cms_file = upload_file(img['src'])
      if cms_file
        img['src'] = "__CMS_FILE_URL_#{cms_file.file.filename}"
      end
    end

    # Add spacing classes to emulate old header behavior
    doc.css('h1, h2, h3').each do |header|
      header['class'] = [header['class'], 'my-3'].compact.join(' ')
    end
    doc.css('h4, h5, h6').each do |header|
      header['class'] = [header['class'], 'my-2'].compact.join(' ')
    end

    # Nokogiri will escape "{% page_url something_or_other %}" in a href tag, so we temporarily set the href to
    # __PAGE_URL_something_or_other and then post-process it to Liquid here.
    doc.to_s.gsub(/__PAGE_URL_(\w+)/, '{% page_url \1 %}').gsub(/__CMS_FILE_URL_([^\"]+)/, '{% file_url "\1" %}')
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def intercode2_path_for_link(url)
    case url
    when /\A\\\"(.*)\\\"\z/
      # Some URLs are improperly escaped/quoted in the Intercode 1 content set.  Let's go above and beyond the
      # call of duty and fix them.
      intercode2_path_for_link($1)
    when /ConComSchedule\.php/
      "__PAGE_URL_con_com_schedule"
    when /[Ss]tatic\.php\?page=(\w+)/
      "__PAGE_URL_#{Cadmus::Slugs.slugify($1)}"
    else
      parsed_url = URI.parse(url)
      if parsed_url.scheme.blank? && parsed_url.path.present?
        logger.warn("Unknown URL: #{url}")
      end
      url
    end
  end

  def upload_file(url)
    parsed_url = URI.parse(url)
    return unless parsed_url.scheme.blank? && parsed_url.path.present? # it's a local file in the source tree

    cms_file = convention.cms_files.find_by(file: File.basename(url))

    if cms_file
      cms_file
    else
      cms_file = convention.cms_files.new
      File.open(File.expand_path(url, file_root)) do |f|
        cms_file.file = f
      end

      cms_file.save!
      cms_file
    end
  end
end