# frozen_string_literal: true
require "test_helper"

class GraphqlControllerTest < ActionDispatch::IntegrationTest
  let(:user_con_profile) { create(:user_con_profile) }
  let(:convention) { user_con_profile.convention }

  setup do
    set_convention convention
    sign_in user_con_profile.user
  end

  test "should return my profile" do
    query = <<~GRAPHQL
    query {
      convention: conventionByRequestHost {
        my_profile {
          __typename
          id
          name
        }
      }
    }
    GRAPHQL

    post graphql_url, params: { "query" => query }
    assert_response :success

    json = response.parsed_body
    assert_not json["errors"].present?, json["errors"].to_s
    assert_equal "UserConProfile", json["data"]["convention"]["my_profile"]["__typename"]
    assert_equal user_con_profile.id.to_s, json["data"]["convention"]["my_profile"]["id"]
    assert_equal user_con_profile.name, json["data"]["convention"]["my_profile"]["name"]
  end

  describe "mutations with CSRF protection turned on" do
    let(:mutation) { <<~GRAPHQL }
      mutation UpdateNickname($id: ID!) {
        updateUserConProfile(input: { id: $id, user_con_profile: { nickname: "Changed" } }) {
          user_con_profile { id }
        }
      }
    GRAPHQL

    setup do
      @previous_forgery_protection = ActionController::Base.allow_forgery_protection
      ActionController::Base.allow_forgery_protection = true
    end

    teardown { ActionController::Base.allow_forgery_protection = @previous_forgery_protection }

    it "returns a GraphQL error and changes nothing without a valid token" do
      post graphql_url,
           params: {
             query: mutation,
             variables: {
               id: user_con_profile.id
             }
           },
           headers: {
             "X-CSRF-Token" => "stale"
           },
           as: :json

      assert_response :success
      assert_equal ["ActionController::InvalidAuthenticityToken"], response.parsed_body["errors"].pluck("message")
      assert_not_equal "Changed", user_con_profile.reload.nickname
    end

    it "does the same for a batched request" do
      post graphql_url, params: { _json: [{ query: mutation, variables: { id: user_con_profile.id } }] }, as: :json

      assert_response :success
      errors = response.parsed_body.first["errors"]
      assert_equal ["ActionController::InvalidAuthenticityToken"], errors.pluck("message")
      assert_not_equal "Changed", user_con_profile.reload.nickname
    end

    it "runs the mutation with a valid token" do
      get "http://#{convention.domain}/authenticity_tokens"
      token = response.parsed_body["graphql"]

      post graphql_url,
           params: {
             query: mutation,
             variables: {
               id: user_con_profile.id
             }
           },
           headers: {
             "X-CSRF-Token" => token
           },
           as: :json

      assert_not response.parsed_body["errors"].present?, response.parsed_body["errors"].to_s
      assert_equal "Changed", user_con_profile.reload.nickname
    end
  end
end
