require 'test_helper'

class CmsPartialsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cms_partial = cms_partials(:one)
  end

  test "should get index" do
    get cms_partials_url
    assert_response :success
  end

  test "should get new" do
    get new_cms_partial_url
    assert_response :success
  end

  test "should create cms_partial" do
    assert_difference('CmsPartial.count') do
      post cms_partials_url, params: { cms_partial: {  } }
    end

    assert_redirected_to cms_partial_url(CmsPartial.last)
  end

  test "should show cms_partial" do
    get cms_partial_url(@cms_partial)
    assert_response :success
  end

  test "should get edit" do
    get edit_cms_partial_url(@cms_partial)
    assert_response :success
  end

  test "should update cms_partial" do
    patch cms_partial_url(@cms_partial), params: { cms_partial: {  } }
    assert_redirected_to cms_partial_url(@cms_partial)
  end

  test "should destroy cms_partial" do
    assert_difference('CmsPartial.count', -1) do
      delete cms_partial_url(@cms_partial)
    end

    assert_redirected_to cms_partials_url
  end
end
