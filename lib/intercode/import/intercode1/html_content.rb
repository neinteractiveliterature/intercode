class Intercode::Import::Intercode1::HtmlContent
  attr_reader :convention, :content_path, :constants_file

  def initialize(convention, content_path, constants_file)
    @convention = convention
    @content_path = content_path
    @constants_file = constants_file
  end

  def import!
    logger.info "Importing HTML content"

    html_paths.each do |html_path|
      logger.info "Importing #{html_path}"
      build_content(html_path).save!
    end
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def html_paths
    @html_paths ||= Dir[File.expand_path('*.html', content_path)]
  end

  def build_content(html_path)
    page_name = Pathname.new(html_path).relative_path_from(Pathname.new(content_path)).to_s.gsub(/\.html\z/, '')
    content = html_content(html_path)

    case page_name
    when 'acceptingbids', 'bidding1', 'bidearly', 'copyright', 'logintop', 'loginbottom'
      # The TEXT_DIR contains partials mixed with pages, with no real indication which is which.  This is a list
      # of known partials in Intercode 1, which we'll turn into partials here too.
      convention.cms_partials.new(name: page_name, content: content)
    else
      convention.pages.new(name: page_name, content: content)
    end
  end

  def html_content(html_path)
    processed_content = process_php_fragment(html_path)
    doc = Nokogiri::HTML::DocumentFragment.parse(processed_content, 'UTF-8')

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

    # Nokogiri will escape "{% page_url something_or_other %}" in a href tag, so we temporarily set the href to
    # __PAGE_URL_something_or_other and then post-process it to Liquid here.
    doc.to_s.gsub(/__PAGE_URL_(\w+)/, '{% page_url \1 %}').gsub(/__CMS_FILE_URL_([^\"]+)/, '{% file_url "\1" %}')
  end

  # The "html" files inside Intercode 1 are actually fragments of PHP that assume intercon_db.inc has been
  # loaded before they're executed.  So let's do the needful here.
  def process_php_fragment(path)
    raw_content = File.read(path)
    php = <<-PHP
<?php
  error_reporting(E_ERROR);
  date_default_timezone_set(\"#{convention.timezone_name}\");
  require \"#{intercon_db_inc_path}\";
?>
#{raw_content}
PHP

    Intercode::Import::Intercode1::Php.exec_php(php).strip
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
      File.open(File.expand_path(url, source_path)) do |f|
        cms_file.file = f
      end

      cms_file.save!
      cms_file
    end
  end

  def intercon_db_inc_path
    @intercon_db_inc_path ||= File.expand_path("intercon_db.inc", source_path)
  end

  def source_path
    @source_path ||= File.dirname(constants_file)
  end
end