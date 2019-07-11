class Queries::DisjunctiveWhere
  def self.build(scope, &block)
    instance = new(scope)
    block.call(instance)
    instance.resolve
  end

  attr_reader :scope, :where_clauses

  def initialize(scope)
    @scope = scope
    @where_clauses = []
  end

  def add(where_clause)
    @where_clauses << where_clause
  end

  def resolve
    return scope if where_clauses.none?

    initial_scope = scope.where(where_clauses.first)
    where_clauses.slice(1..-1).inject(initial_scope) do |working_scope, clause|
      working_scope.or(scope.where(clause))
    end
  end
end
