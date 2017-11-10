require 'test_helper'

describe TeamMembersController do
  let(:team_member) { FactoryBot.create(:team_member) }
  let(:event) { team_member.event }
  let(:convention) { event.convention }

  setup do
    set_convention convention
    sign_in team_member.user

    team_member
  end

  test "should get index" do
    get :index, params: { event_id: event }
    assert_response :success
    assert_not_nil assigns(:team_members)
  end

  test "should get new" do
    get :new, params: { event_id: event }
    assert_response :success
  end

  test "should get edit" do
    get :edit, params: { event_id: event, id: team_member }
    assert_response :success
  end
end
