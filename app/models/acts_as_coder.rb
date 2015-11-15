# Classes that include ActiveModel::Model can say `extend ActsAsCoder` to be usable as ActiveRecord serialization
# coders.  This will enable ActiveRecord models to embed more complex business logic configuration as JSON fields.
# This works with databases that support JSON datatypes natively (e.g. PostgreSQL) or ones that don't (e.g. SQLite3).
module ActsAsCoder
  def dump(model)
    model.to_json
  end

  def load(json)
    self.new.tap do |model|
      case json
      when Hash then model.assign_attributes(json)
      when String then model.from_json(json)
      end
    end
  end
end