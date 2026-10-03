# frozen_string_literal: true
require "csv"

# Helpers for testing Tables::TableResultsPresenter subclasses.  Including classes must define `build_presenter`, which
# takes filters:, sort:, and visible_field_ids: keyword arguments and returns a presenter.
module TablePresenterTestHelper
  def filtered_ids(field, value)
    build_presenter(filters: { field.to_s => value }).scoped.map(&:id)
  end

  def sorted_ids(field, desc: false)
    build_presenter(sort: [{ field: field.to_s, desc: desc }]).scoped.map(&:id)
  end

  def csv_rows(visible_field_ids = nil)
    CSV.parse(build_presenter(visible_field_ids:).csv_enumerator.to_a.join)
  end

  # Returns the CSV cell value for the first data row of the given field
  def csv_cell(field)
    csv_rows([field.to_s]).second&.first
  end

  def assert_sortable(*fields)
    fields.each do |field|
      assert_equal sorted_ids(field).sort, sorted_ids(field, desc: true).sort, "#{field} should be sortable"
    end
  end
end
