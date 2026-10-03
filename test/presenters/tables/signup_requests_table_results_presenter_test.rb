# frozen_string_literal: true
require "test_helper"

class Tables::SignupRequestsTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:site_admin) { create(:site_admin) }
  let(:convention) { create(:convention) }
  let(:the_run) { create(:run, event: create(:event, convention:)) }
  let(:pending_request) { create(:signup_request, target_run: the_run, state: "pending") }
  let(:rejected_request) { create(:signup_request, target_run: the_run, state: "rejected") }

  before do
    pending_request
    rejected_request
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::SignupRequestsTableResultsPresenter.for_convention(
      convention:,
      pundit_user: site_admin,
      filters:,
      sort:,
      visible_field_ids:
    )
  end

  it "filters by state" do
    assert_equal [rejected_request.id], filtered_ids(:state, "rejected")
  end

  it "sorts by state in workflow order" do
    assert_equal [pending_request.id, rejected_request.id], sorted_ids(:state)
    assert_equal [rejected_request.id, pending_request.id], sorted_ids(:state, desc: true)
  end
end
