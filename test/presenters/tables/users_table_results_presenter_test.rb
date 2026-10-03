# frozen_string_literal: true
require "test_helper"

class Tables::UsersTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:alice) { create(:user, first_name: "Alice", last_name: "Zimmer", email: "alice@example.com") }
  let(:bob) { create(:site_admin, first_name: "Bob", last_name: "Adams", email: "bob@example.net") }

  before do
    alice
    bob
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::UsersTableResultsPresenter.new(User.all, filters, sort, visible_field_ids)
  end

  it "filters by name, first name, last name, and email" do
    assert_equal [alice.id], filtered_ids(:name, "Alice")
    assert_equal [bob.id], filtered_ids(:first_name, "Bob")
    assert_equal [alice.id], filtered_ids(:last_name, "Zimmer")
    assert_equal [bob.id], filtered_ids(:email, "EXAMPLE.NET")
  end

  it "filters by privileges" do
    assert_equal [bob.id], filtered_ids(:privileges, ["site_admin"])
    assert_equal [alice.id, bob.id].sort, filtered_ids(:privileges, []).sort
  end

  it "sorts" do
    assert_equal [bob.id, alice.id], sorted_ids(:name)
    assert_equal [alice.id, bob.id], sorted_ids(:name, desc: true)
    assert_equal [alice.id, bob.id], sorted_ids(:first_name)
    assert_equal [bob.id, alice.id], sorted_ids(:last_name)
    assert_equal [alice.id, bob.id], sorted_ids(:email)
    assert_sortable(:privileges)
  end

  it "exports CSV" do
    rows = csv_rows(%w[first_name email])

    assert_equal ["First name", "Email"], rows.first
    assert_equal [%w[Alice alice@example.com], %w[Bob bob@example.net]], rows.drop(1).sort
  end
end
