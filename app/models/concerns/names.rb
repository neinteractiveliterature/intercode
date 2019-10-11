module Names
  def self.string_search(scope, search_string, columns)
    model = scope.is_a?(ActiveRecord::Relation) ? scope.model : scope
    query = columns.map { |column| "lower(#{model.table_name}.#{column}) like :term" }.join(' OR ')

    search_string.split(/\s+/).select(&:present?).inject(scope || model) do |working_scope, term|
      working_scope.where(query, term: "%#{term.downcase}%")
    end
  end

  extend ActiveSupport::Concern

  # Return the user's name.
  def name
    name_parts.compact.join(' ')
  end

  # Return the user's name in last, first format.
  def name_inverted
    [last_name, first_name].compact.join(', ')
  end

  def name_parts
    [first_name, last_name]
  end

  included do
    scope :name_search, ->(search_string, columns: %w[first_name last_name]) do
      Names.string_search(self, search_string, columns)
    end
  end
end
