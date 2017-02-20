class Intercode::Import::Intercode1::HtmlContent
  attr_reader :convention, :content_path, :constants_file

  def initialize(convention, content_path, constants_file)
    @convention = convention
    @content_path = content_path
    @constants_file = constants_file
  end

  def import!
    logger = Intercode::Import::Intercode1.logger
    logger.info "Importing HTML content"

    html_paths.each do |html_path|
      logger.info "Importing #{html_path}"
      build_page(html_path).save!
    end
  end

  private

  def html_paths
    @html_paths ||= Dir[File.expand_path('*.html', content_path)]
  end

  def build_page(html_path)
    page_name = Pathname.new(html_path).relative_path_from(Pathname.new(content_path)).to_s.gsub(/\.html\z/, '')
    convention.pages.new(name: page_name, content: html_content(html_path))
  end

  def html_content(html_path)
    raw_content = File.read(html_path)
    php = "<?php require \"#{constants_file}\" ?>\n#{raw_content}"

    processed_content = Intercode::Import::Intercode1::Php.exec_php(php).strip
    doc = Nokogiri::HTML(processed_content, nil, 'UTF-8')

    # Try to fix up internal links to other CMS pages
    doc.css('a[href]').each do |link|
      link['href'] = intercode2_path_for_link(link['href'])
    end

    doc.to_s.gsub(/__PAGE_URL_(\w+)/, '{% page_url \1 %}')
  end

  def intercode2_path_for_link(url)
    case url
    when /ConComSchedule\.php/
      "__PAGE_URL_con_com_schedule"
    when /Static\.php\?page=(\w+)/
      "__PAGE_URL_#{Cadmus::Slugs.slugify($1)}"
    else
      url
    end
  end
end