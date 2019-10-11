module ExclusiveArc
  extend ActiveSupport::Concern

  class_methods do
    def exclusive_arc(name, model_classes)
      arc = ExclusiveArc.new(name, model_classes)
      instance_variable_set(:"@#{name}_exclusive_arc", arc)
      singleton_class.instance_eval do
        attr_reader :"#{name}_exclusive_arc"
      end

      model_classes.each do |model_class|
        belongs_to arc.association_name(model_class).to_sym, optional: true
      end

      scope "for_#{name}", ->(object) do
        arc.finder_scope(self, object)
      end

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

      unless object_class
        raise ArgumentError,
          "#{scope.model} does not support #{object.class} #{name.to_s.pluralize}"
      end

      scope.where("#{association_name(object_class)}_id": object.id)
    end

    def get_association(record)
      possible_objects = model_classes.map do |model_class|
        record.public_send(association_name(model_class))
      end

      possible_objects.compact.first
    end

    def set_association(record, value)
      model_classes.each do |model_class|
        record.public_send("#{association_name(model_class)}=", nil)
      end
      return if value.nil?

      value_class = model_class_for_object(value)
      unless value_class
        raise ArgumentError,
          "#{record.class} does not support #{value.class} #{name.to_s.pluralize}"
      end

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
