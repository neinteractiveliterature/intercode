# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::CreateOrderTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:attendee) { create(:user_con_profile, convention:) }
  let(:product) { create(:product, convention:) }
  let(:admin) do
    user = create_user_with_permissions_in_convention(%w[update_orders read_orders], convention)
    user.user_con_profiles.find_by!(convention:)
  end

  MUTATION = <<~GRAPHQL
    mutation TestCreateOrder($userConProfileId: ID!, $status: OrderStatus!, $order: OrderInput!, $orderEntries: [OrderEntryInput!]) {
      createOrder(input: { userConProfileId: $userConProfileId, status: $status, order: $order, order_entries: $orderEntries }) {
        order {
          id
          status
          payment_note
          payment_amount { fractional }
          order_entries { id quantity price_per_item { fractional } product { id } }
        }
      }
    }
  GRAPHQL

  def create_order(
    as:,
    status: "paid",
    order: { "payment_note" => "Paid at the door" },
    order_entries: nil,
    profile: attendee
  )
    execute_graphql_query(
      MUTATION,
      user_con_profile: as,
      variables: {
        "userConProfileId" => profile.id.to_s,
        "status" => status,
        "order" => order,
        "orderEntries" => order_entries
      }
    )
  end

  it "lets users with update_orders create a paid order for an attendee" do
    result =
      create_order(
        as: admin,
        order: {
          "payment_note" => "Paid at the door",
          "payment_amount" => {
            "fractional" => 2000,
            "currency_code" => "USD"
          }
        },
        order_entries: [{ "productId" => product.id.to_s, "quantity" => 2 }]
      )

    order = Order.find(result["data"]["createOrder"]["order"]["id"])
    assert_equal attendee, order.user_con_profile
    assert_equal "paid", order.status
    assert_equal "Paid at the door", order.payment_note
    assert_equal Money.new(2000, "USD"), order.payment_amount
    assert_not_nil order.submitted_at
    assert_equal([[product, 2]], order.order_entries.map { |entry| [entry.product, entry.quantity] })
  end

  it "can create unpaid orders" do
    result = create_order(as: admin, status: "unpaid")

    assert_equal "unpaid", result["data"]["createOrder"]["order"]["status"]
  end

  it "refuses to create pending orders" do
    error = assert_raises(GraphqlTestExecutionError) { create_order(as: admin, status: "pending") }

    assert_match(/Cannot create pending orders/, error.message)
    assert_equal 0, attendee.orders.count
  end

  it "lets admins set a price for an entry" do
    result =
      create_order(
        as: admin,
        order_entries: [
          {
            "productId" => product.id.to_s,
            "quantity" => 1,
            "price_per_item" => {
              "fractional" => 500,
              "currency_code" => "USD"
            }
          }
        ]
      )

    entry = Order.find(result["data"]["createOrder"]["order"]["id"]).order_entries.first
    assert_equal Money.new(500, "USD"), entry.price_per_item
  end

  it "attaches one of the attendee's existing tickets to an entry" do
    ticket_type = create(:paid_ticket_type, convention:)
    ticket = create(:ticket, ticket_type:, user_con_profile: attendee)

    result =
      create_order(
        as: admin,
        order_entries: [
          { "productId" => ticket_type.providing_products.first.id.to_s, "quantity" => 1, "ticketId" => ticket.id.to_s }
        ]
      )

    entry = Order.find(result["data"]["createOrder"]["order"]["id"]).order_entries.first
    assert_equal entry, ticket.reload.order_entry
  end

  it "doesn't attach someone else's ticket to an entry" do
    ticket_type = create(:paid_ticket_type, convention:)
    other_ticket = create(:ticket, ticket_type:, user_con_profile: create(:user_con_profile, convention:))

    # (In production the controller rolls the whole request back on any error, so the order isn't left behind.)
    error =
      assert_raises(GraphqlTestExecutionError) do
        create_order(
          as: admin,
          order_entries: [
            {
              "productId" => ticket_type.providing_products.first.id.to_s,
              "quantity" => 1,
              "ticketId" => other_ticket.id.to_s
            }
          ]
        )
      end

    assert_match(/not found/, error.message)
    assert_nil other_ticket.reload.order_entry
  end

  it "doesn't let regular attendees create orders, even for themselves" do
    error = assert_raises(GraphqlTestExecutionError) { create_order(as: attendee, profile: attendee) }

    assert_match(/Unauthorized mutation/, error.message)
    assert_equal 0, attendee.orders.count
  end

  it "doesn't let users with only read_orders create orders" do
    reader = create_user_with_read_orders_in_convention(convention).user_con_profiles.find_by!(convention:)

    assert_raises(GraphqlTestExecutionError) { create_order(as: reader) }
    assert_equal 0, attendee.orders.count
  end

  it "doesn't let admins from another convention create orders" do
    other_admin = create_user_with_update_orders_in_convention(create(:convention)).user_con_profiles.first

    assert_raises(GraphqlTestExecutionError) { create_order(as: other_admin) }
    assert_equal 0, attendee.orders.count
  end
end
# rubocop:enable GraphQL/ObjectDescription
