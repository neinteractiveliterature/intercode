module Intercode::Import::Intercode1::UploadFile
  def upload_file(convention, path)
    cms_file = convention.cms_files.find_by(file: File.basename((path)))

    if cms_file
      cms_file
    else
      cms_file = convention.cms_files.new
      File.open(path) do |f|
        cms_file.file = f
      end

      cms_file.save!
      cms_file
    end
  end
end