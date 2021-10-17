module Intercode::Import::Intercode1::UploadFile
  def upload_file(convention, path)
    cms_file = convention.cms_files.find_by(file: File.basename((path)))

    if cms_file
      cms_file
    else
      return unless File.exist?(path)

      cms_file = convention.cms_files.new
      File.open(path) { |f| cms_file.file = f }

      cms_file.save!
      cms_file
    end
  end
end
