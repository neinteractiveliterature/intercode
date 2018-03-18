class Tables::TableResultsPresenter
  attr_reader :base_scope, :filters, :sort

  def initialize(base_scope, filters, sort)
    @base_scope = base_scope
    @filters = filters
    @sort = sort
  end

  def scoped
    apply_sort(apply_filters(base_scope))
  end

  private

  def apply_filters(scope)
    return scope unless filters.present?

    filters.inject(scope) do |current_scope, (filter, value)|
      apply_filter(current_scope, filter.to_sym, value)
    end
  end

  def apply_sort(scope)
    return scope unless sort.present?

    expanded_scope = sort.inject(scope) do |current_scope, sort_entry|
      expand_scope_for_sort(current_scope, sort_entry[:field].to_sym)
    end

    expanded_scope.order(
      sort.map do |entry|
        direction = entry[:desc] ? 'DESC' : 'ASC'
        sql_order_for_sort_field(entry[:field].to_sym, direction)
      end
    )
  end

  def apply_filter(_scope, _filter, _value)
    raise 'Subclasses must implement #apply_filter!'
  end

  def expand_scope_for_sort(scope, _sort_field)
    scope
  end

  def sql_order_for_sort_field(field, direction)
    "#{field} #{direction}"
  end
end
