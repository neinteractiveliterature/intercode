# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::AddOrderEntryToCurrentPendingOrderTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }

  MUTATION = <<~GRAPHQL
    mutation TestAddOrderEntryToCurrentPendingOrder($productId: ID!, $quantity: Int!) {
      addOrderEntryToCurrentPendingOrder(
        input: { order_entry: { productId: $productId, quantity: $quantity } }
      ) {
        order_entry { id }
      }
    }
  GRAPHQL

  describe "a ticket-providing product" do
    let(:ticket_type) { create(:paid_ticket_type, convention:) }
    let(:product) { ticket_type.providing_products.first }

    before { product.update!(available: true) }

    it "adds the product to the cart" do
      result =
        execute_graphql_query(
          MUTATION,
          user_con_profile:,
          variables: {
            "productId" => product.id.to_s,
            "quantity" => 1
          }
        )
      assert_not_nil result["data"]["addOrderEntryToCurrentPendingOrder"]["order_entry"]
    end
  end

  describe "if the con is sold out" do
    let(:ticket_type) { create(:paid_ticket_type, convention:) }
    let(:product) { ticket_type.providing_products.first }
    let(:lucky_winner) { create(:user_con_profile, convention:) }

    before do
      product.update!(available: true)
      convention.update!(maximum_tickets: 1)
      create(:ticket, ticket_type:, user_con_profile: lucky_winner)
    end

    it "fails with a sold out error and does not add anything to the cart" do
      error =
        assert_raises(GraphqlTestExecutionError) do
          execute_graphql_query(
            MUTATION,
            user_con_profile:,
            variables: {
              "productId" => product.id.to_s,
              "quantity" => 1
            }
          )
        end
      assert_match(/currently sold out/, error.message)
      assert_equal 0, OrderEntry.where(product:).count
    end
  end

  describe "a non-ticket-providing product" do
    let(:product) { create(:product, convention:, available: true) }

    describe "even if the con is sold out" do
      before { convention.update!(maximum_tickets: 0) }

      it "still adds the product to the cart" do
        result =
          execute_graphql_query(
            MUTATION,
            user_con_profile:,
            variables: {
              "productId" => product.id.to_s,
              "quantity" => 1
            }
          )
        assert_not_nil result["data"]["addOrderEntryToCurrentPendingOrder"]["order_entry"]
      end
    end
  end
end
# rubocop:enable GraphQL/ObjectDescription
