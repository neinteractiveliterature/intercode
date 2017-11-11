require 'test_helper'

describe EventsController do
  let(:convention) { FactoryBot.create(:convention) }
  let(:event) { FactoryBot.create(:event, convention: convention) }

  setup do
    set_convention convention
  end

  test "should get index" do
    get :index
    assert_response :success
  end

  it 'should not let you view the index page in run order unless you can see the schedule' do
    convention.update!(show_schedule: 'gms')
    get :index, params: { sort: 'first_scheduled_run' }
    assert_response :redirect
    assert flash[:alert]
  end

  describe "as a con staffer" do
    let(:staff_con_profile) { FactoryBot.create :user_con_profile, convention: convention, staff: true }
    let(:staff_user) { staff_con_profile.user }

    setup do
      sign_in staff_user
    end

    test "should get edit" do
      get :edit, params: { id: event.id }
      assert_response :success
    end
  end
end
