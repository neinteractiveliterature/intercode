# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::UpdateConventionTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates, name: "Original Con") }
  let(:admin_user) { create_user_with_update_convention_in_convention(convention) }
  let(:admin_profile) { admin_user.user_con_profiles.find_by!(convention:) }

  MUTATION = <<~GRAPHQL
    mutation TestUpdateConvention($id: ID, $convention: ConventionInput!) {
      updateConvention(input: { id: $id, convention: $convention }) {
        convention { id name signup_rounds { id start maximum_event_signups } }
      }
    }
  GRAPHQL

  def update_convention(as:, attrs:, id: nil)
    execute_graphql_query(MUTATION, user_con_profile: as, variables: { "id" => id&.to_s, "convention" => attrs })
  end

  it "lets users with update_convention update the convention they're in" do
    result = update_convention(as: admin_profile, attrs: { "name" => "Renamed Con", "location" => nil })

    assert_equal "Renamed Con", result["data"]["updateConvention"]["convention"]["name"]
    assert_equal "Renamed Con", convention.reload.name
  end

  it "records who made the change" do
    update_convention(as: admin_profile, attrs: { "name" => "Renamed Con" })

    assert_equal admin_user, convention.reload.updated_by
  end

  it "can update the convention by ID" do
    update_convention(as: admin_profile, id: convention.id, attrs: { "name" => "Renamed By ID" })

    assert_equal "Renamed By ID", convention.reload.name
  end

  it "only changes the fields it's given" do
    convention.update!(ticket_name: "badge")

    update_convention(as: admin_profile, attrs: { "name" => "Renamed Con" })

    assert_equal "badge", convention.reload.ticket_name
  end

  it "doesn't save anything if the update is invalid" do
    assert_raises(GraphqlTestExecutionError) { update_convention(as: admin_profile, attrs: { "name" => "" }) }

    assert_equal "Original Con", convention.reload.name
  end

  describe "with a maximum_event_signups schedule" do
    let(:first_start) { Time.zone.parse("2026-01-01 12:00") }
    let(:second_start) { Time.zone.parse("2026-02-01 12:00") }
    let(:schedule) do
      {
        "timespans" => [
          { "start" => first_start.iso8601, "finish" => second_start.iso8601, "string_value" => "1" },
          { "start" => second_start.iso8601, "finish" => nil, "string_value" => "unlimited" }
        ]
      }
    end

    it "replaces the convention's signup rounds with the schedule" do
      result = update_convention(as: admin_profile, attrs: { "maximum_event_signups" => schedule })

      assert_equal(
        [[first_start, "1"], [second_start, "unlimited"]],
        convention.signup_rounds.reload.order(:start).map { |round| [round.start, round.maximum_event_signups] }
      )
      assert_equal 2, result["data"]["updateConvention"]["convention"]["signup_rounds"].size
    end

    it "leaves the signup rounds alone when no schedule is given" do
      original_ids = convention.signup_rounds.pluck(:id)

      update_convention(as: admin_profile, attrs: { "name" => "Renamed Con" })

      assert_equal original_ids, convention.signup_rounds.reload.pluck(:id)
    end

    it "refuses to replace signup rounds that ranked choice decisions refer to, and changes nothing" do
      round = convention.signup_rounds.first
      profile = create(:user_con_profile, convention:)
      RankedChoiceDecision.create!(
        user_con_profile: profile,
        signup_round: round,
        decision: "skip_user",
        reason: "no_pending_choices"
      )

      assert_raises(GraphqlTestExecutionError) do
        update_convention(as: admin_profile, attrs: { "name" => "Renamed Con", "maximum_event_signups" => schedule })
      end

      assert_equal "Original Con", convention.reload.name
      assert_equal [round.id], convention.signup_rounds.reload.pluck(:id)
    end
  end

  it "doesn't let regular attendees update the convention" do
    regular = create(:user_con_profile, convention:)

    error = assert_raises(GraphqlTestExecutionError) { update_convention(as: regular, attrs: { "name" => "Hijacked" }) }

    assert_match(/Unauthorized mutation/, error.message)
    assert_equal "Original Con", convention.reload.name
  end

  it "doesn't let staff with other permissions update the convention" do
    staff = create_user_with_permissions_in_convention(%w[update_events update_signups], convention)

    assert_raises(GraphqlTestExecutionError) do
      update_convention(as: staff.user_con_profiles.first, attrs: { "name" => "Hijacked" })
    end
    assert_equal "Original Con", convention.reload.name
  end

  it "doesn't let an admin of one convention update another one by ID" do
    other_admin = create_user_with_update_convention_in_convention(create(:convention)).user_con_profiles.first

    assert_raises(GraphqlTestExecutionError) do
      update_convention(as: other_admin, id: convention.id, attrs: { "name" => "Hijacked" })
    end
    assert_equal "Original Con", convention.reload.name
  end

  it "lets site admins update any convention by ID" do
    site_admin_profile = create(:user_con_profile, convention: create(:convention), user: create(:site_admin))

    update_convention(as: site_admin_profile, id: convention.id, attrs: { "name" => "Renamed By Site Admin" })

    assert_equal "Renamed By Site Admin", convention.reload.name
  end
end
# rubocop:enable GraphQL/ObjectDescription
