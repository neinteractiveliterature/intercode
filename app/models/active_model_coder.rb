# Classes that include ActiveModel::Model can say `extend ActsAsCoder` to be usable as ActiveRecord
# serialization coders.  This will enable ActiveRecord models to embed more complex business logic
# configuration as JSON fields. This works with databases that support JSON datatypes natively
# (e.g. PostgreSQL) or ones that don't (e.g. SQLite3).
class ActiveModelCoder
  attr_reader :class_name

  def initialize(class_name)
    @class_name = class_name
  end

  def dump(model)
    model.to_json
  end

  def load(json)
    model_class.new.tap do |model|
      case json
      when Hash then model.assign_attributes(json)
      when String then model.from_json(json)
      end
    end
  end

  def model_class
    @model_class ||= class_name.safe_constantize
  end
end
