class ImportFormContentService < ApplicationService
  DIRECT_PROPERTY_NAMES = %i[item_type identifier admin_description default_value]

  attr_reader :form, :content

  def initialize(form:, content:)
    @form = form
    @content = content.deep_symbolize_keys
  end

  private

  def inner_call
    ActiveRecord::Base.transaction do
      logger.info 'Clearing any existing content'
      form.form_sections.destroy_all

      form.title = content[:title]
      content[:sections].each do |section_attributes|
        import_section(section_attributes)
      end
    end

    success
  end

  def import_section(section_attributes)
    logger.info "Importing section #{section_attributes[:title]}"
    section = form.form_sections.create!(section_attributes.slice(:title))
    (section_attributes[:section_items] || []).each do |item_attributes|
      import_item(section, item_attributes)
    end
  end

  def import_item(section, item_attributes)
    logger.info "Importing #{item_attributes[:item_type]} item #{item_attributes[:identifier]}"
    direct_properties = item_attributes.slice(*DIRECT_PROPERTY_NAMES)
    other_properties = item_attributes.except(*DIRECT_PROPERTY_NAMES)
    section.form_items.create!(direct_properties.merge(properties: other_properties))
  end
end
