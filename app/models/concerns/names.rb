# frozen_string_literal: true
module Names
  def self.string_search(scope, search_string, columns)
    model = scope.is_a?(ActiveRecord::Relation) ? scope.model : scope
    query = columns.map { |column| "lower(#{model.table_name}.#{column}) like :term" }.join(" OR ")

    search_string
      .split(/\s+/)
      .select(&:present?)
      .inject(scope || model) { |working_scope, term| working_scope.where(query, term: "%#{term.downcase}%") }
  end

  extend ActiveSupport::Concern

  # Return the user's name.
  def name
    name_parts.join(" ")
  end

  # Return the user's name in last, first format.
  def name_inverted
    name_parts.reverse.join(", ")
  end

  def name_parts
    [first_name, last_name].map(&:presence).compact
  end

  included do
    scope :name_search,
          ->(search_string, columns: %w[first_name last_name]) { Names.string_search(self, search_string, columns) }
  end
end
