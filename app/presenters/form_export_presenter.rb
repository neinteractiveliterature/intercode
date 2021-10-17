# frozen_string_literal: true
class FormExportPresenter
  attr_reader :form

  def initialize(form)
    @form = form
  end

  def as_json
    {
      title: form.title,
      form_type: form.form_type,
      sections: form.form_sections.order(:position).includes(:form_items).map { |section| export_section(section) }
    }
  end

  private

  def export_section(section)
    {
      'title' => section.title,
      'section_items' => section.form_items.sort_by(&:position).map { |item| export_item(item) }
    }
  end

  def export_item(item)
    item_direct_properties(item).merge(item.properties).compact
  end

  def item_direct_properties(item)
    ImportFormContentService::DIRECT_PROPERTY_NAMES.each_with_object({}) do |property, hash|
      hash[property.to_s] = item.public_send(property)
    end
  end
end
