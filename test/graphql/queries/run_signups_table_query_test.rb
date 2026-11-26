# frozen_string_literal: true
require "test_helper"

describe "RunSignupsTableSignupsQuery" do
  let(:convention) { create(:convention) }
  let(:event) { create(:event, convention:) }
  let(:the_run) { create(:run, event:) }
  let(:viewer) { create(:team_member, event:).user_con_profile }

  let(:query) do
    document = GraphQL.parse(Rails.root.join("app/javascript/EventsApp/SignupAdmin/queries.graphql").read)
    wanted = %w[RunSignupsTableSignupsQuery]
    document.definitions.select { |d| wanted.include?(d.name) }.map(&:to_query_string).join("\n")
  end

  def execute
    execute_graphql_query(
      query,
      user_con_profile: viewer,
      variables: {
        eventId: event.id,
        runId: the_run.id
      },
      operation_name: "RunSignupsTableSignupsQuery"
    )
  end

  it "lets a team member read the personal info of only the people involved in their events" do
    signed_up = create(:signup, run: the_run).user_con_profile
    teammate = create(:team_member, event:).user_con_profile
    withdrawn = create(:signup, run: the_run, state: "withdrawn").user_con_profile
    unrelated = create(:user_con_profile, convention:)

    readable =
      [signed_up, teammate, withdrawn, unrelated].select do |profile|
        UserConProfilePolicy.new(viewer.user, profile).read_personal_info?
      end

    assert_equal [signed_up, teammate], readable
  end

  it "does not query once per signup" do
    5.times { create(:signup, run: the_run) }

    per_signup_queries = [
      /SELECT 1 AS one FROM "signups"/,
      /SELECT 1 AS one FROM "team_members" WHERE "team_members"."user_con_profile_id" = /,
      /SELECT 1 AS one FROM "staff_positions"/,
      /INNER JOIN "runs" ON "events"."id" = "runs"."event_id" WHERE "runs"."id" = /
    ]

    assert_no_queries_match(Regexp.union(per_signup_queries)) { execute }
  end
end
