module Concerns::Names
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
      query = columns.map { |column| "lower(#{table_name}.#{column}) like :term" }.join(' OR ')

      search_string.split(/\s+/).select(&:present?).inject(self) do |working_scope, term|
        working_scope.where(query, term: "%#{term.downcase}%")
      end
    end
  end
end
