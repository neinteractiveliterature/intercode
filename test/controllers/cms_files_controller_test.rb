require 'test_helper'

class CmsFilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cms_file = cms_files(:one)
  end

  test "should get index" do
    get cms_files_url
    assert_response :success
  end

  test "should get new" do
    get new_cms_file_url
    assert_response :success
  end

  test "should create cms_file" do
    assert_difference('CmsFile.count') do
      post cms_files_url, params: { cms_file: {  } }
    end

    assert_redirected_to cms_file_url(CmsFile.last)
  end

  test "should show cms_file" do
    get cms_file_url(@cms_file)
    assert_response :success
  end

  test "should get edit" do
    get edit_cms_file_url(@cms_file)
    assert_response :success
  end

  test "should update cms_file" do
    patch cms_file_url(@cms_file), params: { cms_file: {  } }
    assert_redirected_to cms_file_url(@cms_file)
  end

  test "should destroy cms_file" do
    assert_difference('CmsFile.count', -1) do
      delete cms_file_url(@cms_file)
    end

    assert_redirected_to cms_files_url
  end
end
