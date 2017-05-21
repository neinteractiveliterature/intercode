require 'test_helper'

class CmsPartialsControllerTest < ActionDispatch::IntegrationTest
  let(:convention) { FactoryGirl.create(:convention) }
  let(:user_con_profile) { FactoryGirl.create(:staff_user_con_profile, convention: convention) }
  let(:user) { user_con_profile.user }
  let(:cms_partial) { FactoryGirl.create(:cms_partial, parent: convention) }

  before do
    set_convention convention
    sign_in user
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
      post cms_partials_url, params: { cms_partial: { name: 'jack', content: 'white' } }
    end

    assert_redirected_to cms_partials_url
  end

  test "should show cms_partial" do
    get cms_partial_url(cms_partial)
    assert_response :success
  end

  test "should get edit" do
    get edit_cms_partial_url(cms_partial)
    assert_response :success
  end

  test "should update cms_partial" do
    patch cms_partial_url(cms_partial), params: { cms_partial: { content: 'black' } }
    assert_redirected_to cms_partials_url
  end

  test "should destroy cms_partial" do
    cms_partial

    assert_difference('CmsPartial.count', -1) do
      delete cms_partial_url(cms_partial)
    end

    assert_redirected_to cms_partials_url
  end
end
