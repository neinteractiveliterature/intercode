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
    assign.to_liquid.class.name
  end
end
