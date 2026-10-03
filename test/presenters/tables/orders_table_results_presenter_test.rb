# frozen_string_literal: true
require "test_helper"

class Tables::OrdersTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:convention) { create(:convention) }
  let(:product) { create(:product, convention:) }
  let(:ann) { create(:user_con_profile, convention:, first_name: "Ann", last_name: "Aardvark") }
  let(:zed) { create(:user_con_profile, convention:, first_name: "Zed", last_name: "Zebra") }
  let(:ann_order) { create(:order, user_con_profile: ann, status: "paid", payment_amount: Money.new(1500, "USD")) }
  let(:zed_order) { create(:order, user_con_profile: zed, status: "unpaid") }
  let(:pending_order) { create(:order, user_con_profile: zed, status: "pending") }

  before do
    create(:order_entry, order: ann_order, product:)
    create(:order_entry, order: zed_order, product:)
    pending_order
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::OrdersTableResultsPresenter
      .for_convention(convention, filters, sort)
      .tap do |presenter|
        presenter.instance_variable_set(:@visible_field_ids, visible_field_ids.map(&:to_sym)) if visible_field_ids
      end
  end

  it "excludes pending orders" do
    assert_equal [ann_order.id, zed_order.id].sort, build_presenter.scoped.map(&:id).sort
  end

  it "filters by ID, user name, and status" do
    assert_equal [ann_order.id], filtered_ids(:id, ann_order.id.to_s)
    assert_equal [ann_order.id, zed_order.id].sort, filtered_ids(:id, "not a number").sort
    assert_equal [zed_order.id], filtered_ids(:user_name, "zebra")
    assert_equal [ann_order.id], filtered_ids(:status, "paid")
  end

  it "sorts" do
    assert_equal [ann_order.id, zed_order.id], sorted_ids(:user_name)
    assert_equal [zed_order.id, ann_order.id], sorted_ids(:user_name, desc: true)
    assert_sortable(:status, :submitted_at)
  end

  it "exports CSV" do
    rows = csv_rows(%w[user_name status describe_products payment_amount total_price])

    assert_equal ["User", "Status", "Products", "Payment amount", "Price"], rows.first
    ann_row = rows.find { |row| row.first == "Ann Aardvark" }
    assert_equal "paid", ann_row.second
    assert_includes ann_row.third, product.name
    assert_equal "$15.00", ann_row.fourth
  end
end
