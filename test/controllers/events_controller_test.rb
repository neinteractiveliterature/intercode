require 'test_helper'

describe EventsController do
  let(:event) { FactoryGirl.create(:event) }
  let(:convention) { event.convention }

  setup do
    set_convention convention
  end

  test "should get index" do
    get :index
    assert_response :success
  end

  describe "as a con staffer" do
    let(:staff_con_profile) { FactoryGirl.create :user_con_profile, convention: convention, staff: true }
    let(:staff_user) { staff_con_profile.user }

    setup do
      sign_in staff_user
    end

    test "should get new" do
      get :new
      assert_response :success
    end
  end
end
