class Intercode::Import::Intercode1::FormImporter
  attr_reader :data

  def initialize(json_path)
    @data = JSON.parse(File.read(json_path)).map(&:deep_symbolize_keys)
  end

  def import(form)
    data.each do |section_attributes|
      logger.info "Importing section #{section_attributes[:title]}"
      section = form.form_sections.create!(section_attributes.slice(:title))
      (section_attributes[:section_items] || []).each do |item_attributes|
        logger.info "Importing #{item_attributes[:item_type]} item #{item_attributes[:identifier]}"
        direct_properties = item_attributes.slice(:item_type, :identifier, :admin_description)
        other_properties = item_attributes.except(:item_type, :identifier, :admin_description)
        section.form_items.create!(direct_properties.merge(properties: other_properties))
      end
    end
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end
end
