class Intercode::Import::Intercode1::HtmlContent
  attr_reader :convention, :content_path, :constants_file

  def initialize(convention, content_path, constants_file)
    @convention = convention
    @content_path = content_path
    @constants_file = constants_file
  end

  def import!
    logger.info 'Importing HTML content'

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

    Intercode::Import::Intercode1::HtmlConverter.new(
      html: processed_content,
      convention: convention,
      file_root: source_path
    ).convert
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

  def intercon_db_inc_path
    @intercon_db_inc_path ||= File.expand_path('intercon_db.inc', source_path)
  end

  def source_path
    @source_path ||= File.dirname(constants_file)
  end
end
