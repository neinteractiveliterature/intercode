# frozen_string_literal: true
class LiquidAssignGraphqlPresenter
  def self.from_hash(hash)
    hash.map { |name, assign| new(name, assign) }
  end

  attr_reader :name, :assign

  def initialize(name, assign)
    @name = name
    @assign = assign
  end

  def drop_class_name
    case assign
    when ActiveSupport::SafeBuffer
      'String'
    when Array
      "Array<#{recursive_drop_class_name(nil, assign.first)}>"
    when CmsVariable
      'CmsVariable'
    when Hash
      hash_drop_class_name
    when Proc
      recursive_drop_class_name(name, assign.call)
    else
      assign.to_liquid.class.name
    end
  end

  def cms_variable_value_json
    return unless assign.is_a?(CmsVariable)
    JSON.dump(assign.value)
  end

  private

  def hash_drop_class_name
    key_class_name = recursive_drop_class_name(nil, assign.keys.first)
    value_class_name = recursive_drop_class_name(nil, assign.values.first)
    "Hash<#{key_class_name}, #{value_class_name}>"
  end

  def recursive_drop_class_name(name, value)
    self.class.new(name, value).drop_class_name
  end
end
