require 'test_helper'

describe EventsController do
  let(:convention) { FactoryBot.create(:convention) }
  
  setup do
    set_convention convention
  end

  test 'should get index' do
    get :index
    assert_response :success
  end
end
