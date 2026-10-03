# frozen_string_literal: true
require "test_helper"

class Tables::ConventionsTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:organization) { create(:organization, name: "Zebra Productions") }
  let(:first_convention) { create(:convention, name: "Alpha Con") }
  let(:second_convention) { create(:convention, name: "Beta Con", organization:) }

  before do
    first_convention
    second_convention
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::ConventionsTableResultsPresenter.new(Convention.all, filters, sort, visible_field_ids)
  end

  it "filters by name and organization name" do
    assert_equal [first_convention.id], filtered_ids(:name, "alpha")
    assert_equal [second_convention.id], filtered_ids(:organization_name, "zebra")
    assert_equal [first_convention.id, second_convention.id].sort, filtered_ids(:name, "").sort
  end

  it "sorts" do
    assert_equal [first_convention.id, second_convention.id],
                 build_presenter(sort: [{ field: "name" }]).scoped.map(&:id)
    assert_equal [second_convention.id], sorted_ids(:organization_name, desc: true).first(1)
  end

  it "exports CSV" do
    rows = csv_rows(%w[name])

    assert_equal ["Name"], rows.first
    assert_equal [["Alpha Con"], ["Beta Con"]], rows.drop(1).sort
  end
end
