# frozen_string_literal: true
require "test_helper"

class Tables::CouponsTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:site_admin) { create(:site_admin) }
  let(:convention) { create(:convention) }
  let(:product) { create(:product, convention:) }
  let(:plain_coupon) { create(:coupon, convention:, code: "PLAIN") }
  let(:product_coupon) { create(:coupon, convention:, code: "FREEBIE", provides_product: product, fixed_amount: nil) }

  before do
    plain_coupon
    product_coupon
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::CouponsTableResultsPresenter.for_convention(
      convention:,
      pundit_user: site_admin,
      filters:,
      sort:,
      visible_field_ids:
    )
  end

  it "filters by code" do
    assert_equal [product_coupon.id], filtered_ids(:code, "free")
  end

  it "sorts" do
    assert_equal [product_coupon.id, plain_coupon.id], sorted_ids(:code)
  end

  it "exports CSV including the provided product name" do
    rows = csv_rows(%w[code provides_product])

    assert_equal ["Code", "Provides product"], rows.first
    assert_equal [["FREEBIE", product.name], ["PLAIN", nil]], rows.drop(1).sort
  end
end
