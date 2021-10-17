# frozen_string_literal: true
# Models can say `serialize :field_name, ActiveModelCoder.new('ModelClass')` to make arbitrary
# ActiveModel classes usable as serializable fields.  This will enable ActiveRecord models to embed
# more complex business logic configuration as JSON/JSONB fields.
class ActiveModelCoder
  attr_reader :class_name, :allow_nil

  def initialize(class_name, allow_nil: false)
    @class_name = class_name
    @allow_nil = allow_nil
  end

  def dump(model)
    return nil if allow_nil && model.nil?
    model.as_json
  end

  def load(json)
    return nil if allow_nil && json.nil?

    model_class.new.tap do |model|
      case json
      when Hash
        model.attributes = json
      when String
        model.from_json(json)
      end
    end
  end

  def model_class
    @model_class ||= class_name.safe_constantize
  end
end
