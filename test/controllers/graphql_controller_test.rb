require 'test_helper'

class GraphqlControllerTest < ActionDispatch::IntegrationTest
  let(:user_con_profile) { create :user_con_profile }
  let(:convention) { user_con_profile.convention }

  setup do
    set_convention convention
    sign_in user_con_profile.user
  end

  test 'should return my profile' do
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

    post graphql_url, params: { 'query' => query }
    assert_response :success

    json = JSON.parse(response.body)
    refute json['errors'].present?, json['errors'].to_s
    assert_equal 'UserConProfile', json['data']['convention']['my_profile']['__typename']
    assert_equal user_con_profile.id.to_s, json['data']['convention']['my_profile']['id']
    assert_equal user_con_profile.name, json['data']['convention']['my_profile']['name']
  end
end
