class LiquidAssignGraphqlPresenter
  def self.from_hash(hash)
    hash.map do |name, assign|
      new(name, assign)
    end
  end

  attr_reader :name, :assign

  def initialize(name, assign)
    @name = name
    @assign = assign
  end

  def drop_class_name
    case assign
    when ActiveSupport::SafeBuffer then 'String'
    when Array then "Array<#{LiquidAssignGraphqlPresenter.new(nil, assign.first).drop_class_name}>"
    when CmsVariable then 'CmsVariable'
    when Hash then "Hash<#{LiquidAssignGraphqlPresenter.new(nil, assign.keys.first).drop_class_name}, #{LiquidAssignGraphqlPresenter.new(nil, assign.values.first).drop_class_name}>"
    when Proc then LiquidAssignGraphqlPresenter.new(name, assign.call).drop_class_name
    else assign.to_liquid.class.name
    end
  end

  def cms_variable_value_json
    return unless assign.is_a?(CmsVariable)
    JSON.dump(assign.value)
  end
end
