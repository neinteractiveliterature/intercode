require 'csv'

class Tables::TableResultsPresenter
  class Field
    attr_reader :id, :csv_header, :presenter

    def self.column_filter(column_name = nil, filter_on_blank: false)
      define_method :apply_filter do |scope, value|
        return scope if value.blank? && !filter_on_blank
        scope.where((column_name || id) => value)
      end
    end

    def self.ilike_column_filter(column_name = nil, association_name: nil)
      define_method :apply_filter do |scope, value|
        return scope if value.blank?

        association = scope.model.reflect_on_association(association_name) if association_name

        table_name_quoted = if association
          scope.connection.quote_table_name(association.klass.table_name)
        else
          scope.connection.quote_table_name(scope.model.table_name)
        end
        column_name_quoted = scope.connection.quote_column_name(column_name || id)

        joined_scope = association_name ? scope.joins(association_name) : scope
        joined_scope.where(
          "lower(#{table_name_quoted}.#{column_name_quoted}) like :value",
          value: "%#{value.downcase}%"
        )
      end
    end

    def initialize(presenter)
      @presenter = presenter
    end

    def apply_filter(scope, _value)
      scope
    end

    def expand_scope_for_sort(scope, _direction)
      scope
    end

    def sql_order(direction)
      { id => direction }
    end

    def generate_csv_cell(object)
      object.public_send(id)
    end

    private

    def invert_sort_direction(direction)
      case direction.to_s.upcase
      when 'DESC' then 'ASC'
      else 'DESC'
      end
    end
  end

  class FormField < Field
    attr_reader :form_item

    def initialize(presenter, form_item)
      super(presenter)
      @form_item = form_item
    end

    def id
      form_item.identifier.to_sym
    end

    def csv_header
      form_item.properties['admin_description'] || form_item.identifier.humanize
    end

    def generate_csv_cell(form_response)
      form_response.read_form_response_attribute(id)
    end
  end

  def self.build_field_class(id, csv_header, base = Tables::TableResultsPresenter::Field, &block)
    field_class = Class.new(base) do
      class << self
        attr_reader :id, :csv_header
      end

      def id
        self.class.id
      end

      def csv_header
        self.class.csv_header
      end
    end

    field_class.instance_variable_set(:@id, id.to_sym)
    field_class.instance_variable_set(:@csv_header, csv_header)
    field_class.class_eval(&block) if block

    constant_name = "#{id.to_s.camelize}Field"
    constant_number = 0
    while const_defined?(constant_name)
      constant_number += 1
      constant_name = "#{id.to_s.camelize}Field#{constant_number}"
    end

    const_set(constant_name, field_class)
  end

  def self.field_classes
    @field_classes ||= {}
  end

  def self.field(id, csv_header, base = Tables::TableResultsPresenter::Field, &block)
    id_sym = id.to_sym
    raise "Field #{id_sym} already defined for #{self.class.name}" if field_classes[id_sym]
    field_class = build_field_class(id_sym, csv_header, base, &block)
    field_classes[id_sym] = field_class
  end

  attr_reader :base_scope, :filters, :sort, :visible_field_ids

  def initialize(base_scope, filters, sort, visible_field_ids = nil)
    @base_scope = base_scope
    @filters = filters || {}
    @sort = sort || []
    @visible_field_ids = (visible_field_ids || fields.keys).map(&:to_sym)
  end

  def scoped
    apply_sort(apply_filters(base_scope))
  end

  def paginate(page: nil, per_page: nil)
    scoped.paginate(page: page || 1, per_page: [per_page || 20, 200].min)
  end

  def fields
    self.class.field_classes.transform_values { |field_class| field_class.new(self) }
  end

  def filter_descriptions
    filters.map do |(key, value)|
      field = fields[key.to_sym]
      "#{field.csv_header}: #{value}"
    end
  end

  def visible_fields
    fields.slice(*visible_field_ids.map(&:to_sym)).values
  end

  def csv_enumerator
    return to_enum(:csv_enumerator) unless block_given?

    the_fields = visible_fields
    yield CSV.generate_line(the_fields.map(&:csv_header))

    # I'm gonna make my own find_each, with limits and offsets!
    total_records = csv_scope.count
    batch_size = 1000
    (0..(total_records)).step(batch_size) do |offset|
      csv_scope.limit(batch_size).offset(offset).each do |model|
        csv_data = the_fields.map { |field| field.generate_csv_cell(model) }
        yield CSV.generate_line(csv_data)
      end
    end
  end

  private

  def apply_filters(scope)
    return scope unless filters.present?

    filters.inject(scope) do |current_scope, (filter, value)|
      fields[filter.to_sym].apply_filter(current_scope, value)
    end
  end

  def apply_sort(scope)
    return scope unless sort.present?

    expanded_scope = sort.inject(scope) do |current_scope, sort_entry|
      fields[sort_entry[:field].to_sym].expand_scope_for_sort(
        current_scope,
        sort_entry[:desc] ? 'DESC' : 'ASC'
      )
    end

    expanded_scope.order(
      sort.map do |entry|
        direction = entry[:desc] ? 'DESC' : 'ASC'
        fields[entry[:field].to_sym].sql_order(direction)
      end.compact
    )
  end

  def csv_scope
    scoped
  end
end
