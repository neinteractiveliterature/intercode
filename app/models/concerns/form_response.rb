module Concerns::FormResponse
  extend ActiveSupport::Concern

  included do |base|
    base.class_eval do
      serialize :additional_info, JSON
    end
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
    new_model_attrs = {}
    new_additional_info = self.additional_info || {}

    attributes.stringify_keys.each do |key, value|
      if form_response_attrs.include?(key)
        new_model_attrs[key] = value
      else
        new_additional_info[key] = value
      end
    end

    assign_attributes(new_model_attrs.merge(additional_info: new_additional_info))
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
end
