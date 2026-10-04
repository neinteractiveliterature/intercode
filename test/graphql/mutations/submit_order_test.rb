# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::SubmitOrderTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:attendee) { create(:user_con_profile, convention:) }
  let(:product) { create(:product, convention:) }
  let(:order) { create(:order, user_con_profile: attendee, status: "pending") }

  MUTATION = <<~GRAPHQL
    mutation TestSubmitOrder($id: ID!, $paymentMode: PaymentMode!) {
      submitOrder(input: { id: $id, payment_mode: $paymentMode }) {
        order { id status }
      }
    }
  GRAPHQL

  def submit(as:, payment_mode: "later", target: order)
    execute_graphql_query(
      MUTATION,
      user_con_profile: as,
      variables: {
        "id" => target.id.to_s,
        "paymentMode" => payment_mode
      }
    )
  end

  before { order.order_entries.create!(product:, quantity: 1, price_per_item: Money.new(2000, "USD")) }

  it "lets attendees submit their own orders to pay later" do
    result = submit(as: attendee)

    assert_equal "unpaid", result["data"]["submitOrder"]["order"]["status"]
    order.reload
    assert_equal "unpaid", order.status
    assert_not_nil order.submitted_at
  end

  it "lets attendees submit free orders as paid" do
    order.order_entries.first.update!(price_per_item: Money.new(0, "USD"))

    result = submit(as: attendee, payment_mode: "free")

    assert_equal "paid", result["data"]["submitOrder"]["order"]["status"]
  end

  it "doesn't let a non-free order be submitted as free" do
    error = assert_raises(GraphqlTestExecutionError) { submit(as: attendee, payment_mode: "free") }

    assert_match(/Cannot use free payment mode on an order that costs money/, error.message)
    assert_equal "pending", order.reload.status
  end

  it "lets attendees re-submit their own unpaid orders" do
    order.update!(status: "unpaid")

    result = submit(as: attendee)

    assert_equal "unpaid", result["data"]["submitOrder"]["order"]["status"]
  end

  it "doesn't let attendees submit their own orders once they're paid" do
    order.update!(status: "paid")

    error = assert_raises(GraphqlTestExecutionError) { submit(as: attendee) }

    assert_match(/Unauthorized mutation/, error.message)
    assert_equal "paid", order.reload.status
  end

  it "doesn't let attendees submit other people's orders" do
    stranger = create(:user_con_profile, convention:)

    error = assert_raises(GraphqlTestExecutionError) { submit(as: stranger) }

    assert_match(/Unauthorized mutation/, error.message)
    assert_equal "pending", order.reload.status
  end

  it "lets users with update_orders submit other people's orders" do
    admin =
      create_user_with_permissions_in_convention(%w[update_orders read_orders], convention).user_con_profiles.find_by!(
        convention:
      )

    result = submit(as: admin)

    assert_equal "unpaid", result["data"]["submitOrder"]["order"]["status"]
  end

  it "doesn't let admins from another convention submit orders" do
    other_admin = create_user_with_update_orders_in_convention(create(:convention)).user_con_profiles.first

    assert_raises(GraphqlTestExecutionError) { submit(as: other_admin) }
    assert_equal "pending", order.reload.status
  end
end
# rubocop:enable GraphQL/ObjectDescription
