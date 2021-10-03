# frozen_string_literal: true
module ExclusiveArc
  extend ActiveSupport::Concern

  class_methods do
    def exclusive_arc(name, model_classes)
      arc = ExclusiveArc.new(name, model_classes)
      instance_variable_set(:"@#{name}_exclusive_arc", arc)
      singleton_class.instance_eval { attr_reader :"#{name}_exclusive_arc" }

      model_classes.each { |model_class| belongs_to arc.association_name(model_class).to_sym, optional: true }

      scope "for_#{name}", ->(object) { arc.finder_scope(self, object) }

      define_method name do
        arc.get_association(self)
      end

      define_method "#{name}=" do |value|
        arc.set_association(self, value)
      end
    end
  end

  class ExclusiveArc
    attr_reader :name, :model_classes

    def initialize(name, model_classes)
      @name = name
      @model_classes = model_classes
    end

    def finder_scope(scope, object)
      object_class = model_class_for_object(object)

      raise ArgumentError, "#{scope.model} does not support #{object.class} #{name.to_s.pluralize}" unless object_class

      scope.where("#{association_name(object_class)}_id": object.id)
    end

    def get_association(record)
      possible_objects = model_classes.map { |model_class| record.public_send(association_name(model_class)) }

      possible_objects.compact.first
    end

    def set_association(record, value)
      model_classes.each { |model_class| record.public_send("#{association_name(model_class)}=", nil) }
      return if value.nil?

      value_class = model_class_for_object(value)
      raise ArgumentError, "#{record.class} does not support #{value.class} #{name.to_s.pluralize}" unless value_class

      value_association = association_name(value_class)
      record.public_send("#{value_association}=", value)
    end

    def association_name(model_class)
      model_class.name.demodulize.underscore
    end

    def model_class_for_object(object)
      model_classes.find { |klass| object.is_a?(klass) }
    end
  end
end
