require 'test_helper'

class CmsFilesControllerTest < ActionDispatch::IntegrationTest
  let(:convention) { FactoryBot.create(:convention) }
  let(:user_con_profile) { FactoryBot.create(:staff_user_con_profile, convention: convention) }
  let(:user) { user_con_profile.user }
  let(:cms_file) { FactoryBot.create(:cms_file, parent: convention) }

  before do
    set_convention convention
    sign_in user
  end

  test 'should get index' do
    get cms_files_url
    assert_response :success
  end

  test 'should create cms_file' do
    uploaded_file = Rack::Test::UploadedFile.new(File.expand_path('test/files/war_bond.png', Rails.root), 'image/png')

    assert_difference('CmsFile.count') do
      post cms_files_url, params: { cms_file: { file: uploaded_file } }
    end

    assert_redirected_to cms_files_url
  end

  test 'should destroy cms_file' do
    cms_file

    assert_difference('CmsFile.count', -1) do
      delete cms_file_url(cms_file)
    end

    assert_redirected_to cms_files_url
  end
end
