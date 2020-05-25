module FormResponse
  extend ActiveSupport::Concern

  included do
    has_many :form_response_changes, as: :response
  end

  class_methods do
    def form_response_attrs
      @form_response_attrs || Set.new
    end

    def register_form_response_attrs(*attrs)
      @form_response_attrs ||= Set.new
      @form_response_attrs.merge(attrs.map(&:to_s))
    end
  end

  def assign_form_response_attributes(attributes)
    form_response_attrs = self.class.form_response_attrs

    attributes.stringify_keys.each do |key, value|
      old_value = read_form_response_attribute(key)
      unless normalize_form_response_value(old_value) == normalize_form_response_value(value)
        form_response_attribute_changes[key] = [old_value, value]
      end

      # Go one-by-one because some attributes (e.g. event_email and age_restrictions) do
      # recursive attribute assignment
      if form_response_attrs.include?(key)
        assign_attributes(key => value)
      else
        assign_attributes(additional_info: (additional_info || {}).merge(key => value))
      end
    end
  end

  def read_form_response_attribute(attribute)
    if self.class.form_response_attrs.include?(attribute.to_s)
      public_send(attribute)
    else
      return nil unless additional_info
      additional_info[attribute.to_s]
    end
  end

  def assign_default_values_from_form_items(form_items)
    default_values = {}

    form_items.each do |form_item|
      next unless form_item.identifier && form_item.default_value
      default_values[form_item.identifier.to_s] = form_item.default_value
    end

    assign_form_response_attributes(default_values)
  end

  def read_form_response_attributes_for_form_items(form_items)
    form_items.each_with_object({}) do |form_item, attributes|
      next unless form_item.identifier
      attributes[form_item.identifier] = read_form_response_attribute(form_item.identifier)
    end
  end

  def form_response_attribute_changes
    @form_response_attribute_changes ||= {}
  end

  private

  # Used for comparing values when determining form response changes
  def normalize_form_response_value(value)
    case value
    when Hash then value.stringify_keys
    else value
    end
  end
end
