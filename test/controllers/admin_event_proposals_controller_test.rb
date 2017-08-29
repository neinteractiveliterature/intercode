require 'test_helper'

class AdminEventProposalsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin_event_proposal = admin_event_proposals(:one)
  end

  test "should get index" do
    get admin_event_proposals_url
    assert_response :success
  end

  test "should get new" do
    get new_admin_event_proposal_url
    assert_response :success
  end

  test "should create admin_event_proposal" do
    assert_difference('AdminEventProposal.count') do
      post admin_event_proposals_url, params: { admin_event_proposal: {  } }
    end

    assert_redirected_to admin_event_proposal_url(AdminEventProposal.last)
  end

  test "should show admin_event_proposal" do
    get admin_event_proposal_url(@admin_event_proposal)
    assert_response :success
  end

  test "should get edit" do
    get edit_admin_event_proposal_url(@admin_event_proposal)
    assert_response :success
  end

  test "should update admin_event_proposal" do
    patch admin_event_proposal_url(@admin_event_proposal), params: { admin_event_proposal: {  } }
    assert_redirected_to admin_event_proposal_url(@admin_event_proposal)
  end

  test "should destroy admin_event_proposal" do
    assert_difference('AdminEventProposal.count', -1) do
      delete admin_event_proposal_url(@admin_event_proposal)
    end

    assert_redirected_to admin_event_proposals_url
  end
end
