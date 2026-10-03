# frozen_string_literal: true
require "test_helper"

class Tables::SignupChangesTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:site_admin) { create(:site_admin) }
  let(:convention) { create(:convention) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(
      buckets: [{ key: "players", name: "Players", slots_limited: true, total_slots: 10 }]
    )
  end
  let(:event) { create(:event, convention:, registration_policy:, title: "Dragon Quest") }
  let(:the_run) { create(:run, event:) }
  let(:ann_profile) { create(:user_con_profile, convention:, first_name: "Ann", last_name: "Aardvark") }
  let(:zed_profile) { create(:user_con_profile, convention:, first_name: "Zed", last_name: "Zebra") }
  let(:ann_signup) { create(:signup, run: the_run, user_con_profile: ann_profile) }
  let(:zed_signup) { create(:signup, run: the_run, user_con_profile: zed_profile, state: "waitlisted", counted: false) }
  let(:ann_signup_change) { ann_signup.log_signup_change!(action: "self_service_signup") }
  let(:zed_signup_change) { zed_signup.log_signup_change!(action: "accept_signup_request") }

  before do
    ann_signup_change
    zed_signup_change
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::SignupChangesTableResultsPresenter.for_convention(convention, site_admin, filters, sort, visible_field_ids:)
  end

  it "filters by action, name, and event title" do
    assert_equal [zed_signup_change.id], filtered_ids(:action, "accept_signup_request")
    assert_equal [ann_signup_change.id], filtered_ids(:name, "aardvark")
    assert_equal [ann_signup_change.id, zed_signup_change.id].sort, filtered_ids(:event_title, "dragon").sort
  end

  it "sorts by name" do
    assert_equal [ann_signup_change.id, zed_signup_change.id], sorted_ids(:name)
    assert_equal [zed_signup_change.id, ann_signup_change.id], sorted_ids(:name, desc: true)
  end

  it "exports CSV, including previous state and bucket history" do
    ann_signup.update!(state: "withdrawn", bucket_id: nil)
    ann_signup.log_signup_change!(action: "withdraw")

    rows = csv_rows(%w[name action prev_state state bucket prev_bucket choice])

    assert_equal %w[Name Action Previous\ state State Bucket Previous\ bucket Choice], rows.first
    assert_includes rows,
                    ["Aardvark, Ann", "self_service_signup", nil, "confirmed", "Players (no preference)", nil, "1"]
    assert_includes rows, ["Aardvark, Ann", "withdraw", "confirmed", "withdrawn", nil, "Players (no preference)", "1"]
    assert_includes rows, ["Zebra, Zed", "accept_signup_request", nil, "waitlisted", nil, nil, "N/C"]
  end

  describe ".format_bucket_names" do
    it "describes buckets and requested buckets using the names recorded at the time" do
      format = ->(*args) { Tables::SignupChangesTableResultsPresenter.format_bucket_names(*args) }

      assert_equal "Players (no preference)", format.call("Players", nil)
      assert_equal "Players", format.call("Players", "Players")
      assert_equal "Spectators (requested Players)", format.call("Spectators", "Players")
      assert_equal "None (requested Players)", format.call(nil, "Players")
      assert_nil format.call(nil, nil)
    end
  end
end
