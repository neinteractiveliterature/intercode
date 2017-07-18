class Intercode::Import::Intercode1::EmbeddedPdfPage
  include Intercode::Import::Intercode1::UploadFile

  attr_reader :convention, :content_path, :pdf_filename, :page_name

  def initialize(convention, content_path, pdf_filename, page_name)
    @convention = convention
    @content_path = content_path
    @pdf_filename = pdf_filename
    @page_name = page_name
  end

  def import!
    file_path = File.expand_path(pdf_filename, content_path)
    unless File.exist?(file_path)
      logger.warn("Not creating embedded PDF page #{page_name} for #{pdf_filename} because the file does not exist")
      return
    end

    logger.info("Creating embedded PDF page #{page_name} for #{pdf_filename}")
    cms_file = upload_file(convention, file_path)
    convention.pages.create!(name: page_name, content: page_content(File.basename(pdf_filename)))
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def page_content(filename)
    file_url = "{% file_url \"#{filename}\" %}"

    <<-HTML
<p><a href="#{file_url}" class="btn btn-secondary">Download PDF</a></p>
<iframe src="#{file_url}" style="width: 100%; height: 80vh; border: 1px solid #eee;"></iframe>
HTML
  end
end