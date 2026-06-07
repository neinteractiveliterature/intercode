# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::RateEventTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:event) { create(:event, convention:) }

  RATE_EVENT_MUTATION = <<~GRAPHQL
    mutation TestRateEvent($eventId: ID!, $rating: Int!) {
      rateEvent(input: { eventId: $eventId, rating: $rating }) {
        event {
          id
          my_rating
        }
      }
    }
  GRAPHQL

  describe "rating an event for the first time" do
    it "returns the new rating in the mutation response" do
      result =
        execute_graphql_query(
          RATE_EVENT_MUTATION,
          user_con_profile:,
          variables: {
            "eventId" => event.id.to_s,
            "rating" => 1
          }
        )

      assert_equal 1, result.dig("data", "rateEvent", "event", "my_rating")
    end

    it "persists the rating to the database" do
      execute_graphql_query(
        RATE_EVENT_MUTATION,
        user_con_profile:,
        variables: {
          "eventId" => event.id.to_s,
          "rating" => 1
        }
      )

      assert EventRating.exists?(user_con_profile:, event:, rating: 1)
    end
  end

  describe "updating an existing rating" do
    before { create(:event_rating, user_con_profile:, event:, rating: 1) }

    it "returns the updated rating in the mutation response" do
      result =
        execute_graphql_query(
          RATE_EVENT_MUTATION,
          user_con_profile:,
          variables: {
            "eventId" => event.id.to_s,
            "rating" => -1
          }
        )

      assert_equal(-1, result.dig("data", "rateEvent", "event", "my_rating"))
    end
  end
end
# rubocop:enable GraphQL/ObjectDescription
