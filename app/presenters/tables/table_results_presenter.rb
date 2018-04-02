require 'csv'

class Tables::TableResultsPresenter
  class Field
    attr_reader :id, :csv_header

    def initialize(id, csv_header)
      @id = id
      @csv_header = csv_header
    end
  end

  attr_reader :base_scope, :filters, :sort

  def initialize(base_scope, filters, sort)
    @base_scope = base_scope
    @filters = filters || {}
    @sort = sort || []
  end

  def scoped
    apply_sort(apply_filters(base_scope))
  end

  def fields
    raise 'Subclasses must implement #fields!'
  end

  def filter_descriptions
    filters.map do |(key, value)|
      field = fields.find { |f| f.id.to_s == key.to_s }
      "#{field.csv_header}: #{value}"
    end
  end

  def csv_enumerator
    return to_enum(:csv_enumerator) unless block_given?

    the_fields = fields
    yield CSV.generate_line(the_fields.map(&:csv_header))

    # I'm gonna make my own find_each, with limits and offsets!
    total_records = csv_scope.count
    batch_size = 1000
    (0..(total_records)).step(batch_size) do |offset|
      csv_scope.limit(batch_size).offset(offset).each do |model|
        csv_data = the_fields.map { |field| generate_csv_cell(field, model) }
        yield CSV.generate_line(csv_data)
      end
    end
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

  def expand_scope_for_sort(scope, _sort_field_id)
    scope
  end

  def sql_order_for_sort_field(field_id, direction)
    "#{field_id} #{direction}"
  end

  def generate_csv_cell(_field, _model)
    raise 'Subclasses must implement #generate_csv_cell!'
  end

  def csv_scope
    scoped
  end
end
