# Classes that include ActiveModel::Model can say `extend ActsAsCoder` to be usable as ActiveRecord
# serialization coders.  This will enable ActiveRecord models to embed more complex business logic
# configuration as JSON/JSONB fields.
class ActiveModelCoder
  attr_reader :class_name

  def initialize(class_name)
    @class_name = class_name
  end

  def dump(model)
    model.as_json
  end

  def load(json)
    model_class.new.tap do |model|
      case json
      when Hash
        model.from_json(json.to_json)  # working around lack of assign_attributes in ScheduledValue
      when String
        model.from_json(json)
      end
    end
  end

  def model_class
    @model_class ||= class_name.safe_constantize
  end
end
