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

      form.update_attributes(title: content[:title])
      content[:sections].each_with_index do |section_attributes, i|
        import_section(section_attributes, i + 1)
      end
    end

    success
  end

  def import_section(section_attributes, position)
    logger.info "Importing section #{section_attributes[:title]}"
    section = form.form_sections.create!(section_attributes.slice(:title).merge(position: position))
    (section_attributes[:section_items] || []).each_with_index do |item_attributes, i|
      import_item(section, item_attributes, i + 1)
    end
  end

  def import_item(section, item_attributes, position)
    logger.info "Importing #{item_attributes[:item_type]} item #{item_attributes[:identifier]}"
    direct_properties = item_attributes.slice(*DIRECT_PROPERTY_NAMES)
    other_properties = item_attributes.except(*DIRECT_PROPERTY_NAMES)
    section.form_items.create!(
      direct_properties.merge(properties: other_properties, position: position)
    )
  end
end
