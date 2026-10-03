# frozen_string_literal: true
require "test_helper"

class Tables::RankedChoiceDecisionsTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:site_admin) { create(:site_admin) }
  let(:convention) { create(:convention, signup_automation_mode: "ranked_choice") }
  let(:signup_round) { create(:signup_round, convention:) }
  let(:event) { create(:event, convention:, title: "Dragon Quest") }
  let(:the_run) { create(:run, event:) }
  let(:ann) { create(:user_con_profile, convention:, first_name: "Ann", last_name: "Aardvark") }
  let(:zed) { create(:user_con_profile, convention:, first_name: "Zed", last_name: "Zebra") }
  let(:choice) { create(:signup_ranked_choice, target_run: the_run, user_con_profile: ann) }
  let(:signup_decision) do
    RankedChoiceDecision.create!(
      signup_round:,
      user_con_profile: ann,
      signup_ranked_choice: choice,
      decision: "waitlist",
      reason: "full"
    )
  end
  let(:skip_decision) do
    RankedChoiceDecision.create!(
      signup_round:,
      user_con_profile: zed,
      decision: "skip_user",
      reason: "no_pending_choices"
    )
  end

  before do
    signup_decision
    skip_decision
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::RankedChoiceDecisionsTableResultsPresenter.for_signup_round(
      signup_round:,
      pundit_user: site_admin,
      filters:,
      sort:,
      visible_field_ids:
    )
  end

  it "filters by attendee, event, decision, and reason" do
    assert_equal [skip_decision.id], filtered_ids(:user_con_profile_name, "zebra")
    assert_equal [signup_decision.id], filtered_ids(:event_title, "dragon")
    assert_equal [skip_decision.id], filtered_ids(:decision, "skip_user")
    assert_equal [signup_decision.id], filtered_ids(:reason, "full")
  end

  it "sorts by attendee" do
    assert_equal [signup_decision.id, skip_decision.id], sorted_ids(:user_con_profile_name)
    assert_equal [skip_decision.id, signup_decision.id], sorted_ids(:user_con_profile_name, desc: true)
  end

  it "exports CSV" do
    rows = csv_rows(%w[user_con_profile_name event_title decision reason])

    assert_equal %w[Attendee Event Decision Reason], rows.first
    assert_includes rows, ["Aardvark, Ann", "Dragon Quest", "waitlist", "full"]
    assert_includes rows, ["Zebra, Zed", nil, "skip_user", "no_pending_choices"]
  end
end
