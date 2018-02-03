class Intercode::Import::Intercode1::FormImporter
  attr_reader :data

  def initialize(json_path)
    @data = JSON.parse(File.read(json_path))
  end

  def import(form)
    service = ImportFormContentService.new(form: form, content: data)
    service.logger = Intercode::Import::Intercode1.logger
    service.call!
  end
end
