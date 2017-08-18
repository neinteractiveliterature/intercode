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

    attributes.each do |key, value|
      if form_response_attrs.include?(key.to_s)
        new_model_attrs[key] = value
      else
        new_additional_info[key] = value
      end
    end

    assign_attributes(new_model_attrs.merge(additional_info: new_additional_info))
  end
end
