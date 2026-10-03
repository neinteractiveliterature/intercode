# frozen_string_literal: true
require "test_helper"
require "csv"

class CsvExportsControllerTest < ActionDispatch::IntegrationTest
  let(:convention) { create(:convention) }
  let(:event) { create(:event, convention: convention) }
  let(:signup_run) { create(:run, event: event) }
  let(:con_admin_staff_position) { create(:admin_staff_position, convention: convention) }
  let(:con_admin_profile) do
    profile = create(:user_con_profile, convention: convention)
    con_admin_staff_position.user_con_profiles << profile
    profile
  end
  let(:con_admin) { con_admin_profile.user }

  setup do
    host! convention.domain
    sign_in con_admin
  end

  describe "GET signup_changes" do
    it "exports the convention's signup change log as CSV" do
      signup = create(:signup, run: signup_run)
      signup.log_signup_change!(action: "self_service_signup")

      get csv_exports_signup_changes_path

      assert_response :ok
      csv = CSV.parse(response.body, headers: true)
      assert_equal 1, csv.size
      assert_equal event.title, csv.first["Event"]
      assert_equal "self_service_signup", csv.first["Action"]
    end
  end

  describe "GET signup_changes when not signed in" do
    it "does not crash" do
      sign_out con_admin
      create(:signup, run: signup_run).log_signup_change!(action: "self_service_signup")

      get csv_exports_signup_changes_path

      assert_response :ok
      csv = CSV.parse(response.body, headers: true)
      assert_equal 0, csv.size
    end
  end

  # The SPA's OAuth/OIDC login (OAuthSessionsController#exchange) never calls Devise's
  # sign_in -- it only mints a Doorkeeper access token, held in memory and sent as an
  # `Authorization: Bearer` header on GraphQL requests. A plain <a href> navigation (which
  # is how the CSV export link works) carries neither that header nor any cookie Devise
  # recognizes, so it hits the server unauthenticated even though the user is "signed in"
  # from their own perspective.
  describe "GET signup_changes for an OAuth/OIDC-only session (no Devise session)" do
    let(:frontend_app) { create(:oauth_application, is_intercode_frontend: true) }
    # Matches the scope string the real OIDC login flow requests (see
    # app/javascript/Authentication/openid.ts).
    let(:access_token) do
      Doorkeeper::AccessToken.create!(
        application: frontend_app,
        resource_owner_id: con_admin.id,
        scopes: "public openid email profile read_profile read_signups read_events read_conventions",
        expires_in: 2.hours,
        use_refresh_token: true
      )
    end

    setup do
      sign_out con_admin
      create(:signup, run: signup_run).log_signup_change!(action: "self_service_signup")
      access_token
    end

    it "comes back empty when the bearer token isn't attached (plain link navigation)" do
      get csv_exports_signup_changes_path

      assert_response :ok
      csv = CSV.parse(response.body, headers: true)
      assert_equal 0, csv.size, "expected an empty export, matching the reported bug"
    end

    it "returns real data when the same bearer token is attached (as GraphQL requests do)" do
      get csv_exports_signup_changes_path, headers: { "Authorization" => "Bearer #{access_token.plaintext_token}" }

      assert_response :ok
      csv = CSV.parse(response.body, headers: true)
      assert_equal 1, csv.size, "the same user's data is visible once the bearer token is actually sent"
    end
  end

  describe "GET coupons" do
    it "exports the convention's coupons" do
      create(:coupon, convention:, code: "SAVE10")

      get csv_exports_coupons_path, params: { columns: %w[code] }

      assert_response :ok
      assert_equal [["Code"], ["SAVE10"]], CSV.parse(response.body)
    end
  end

  describe "GET event_proposals" do
    let(:event_category) { create(:event_category, convention:) }
    let(:event_proposal) do
      section = event_category.event_proposal_form.form_sections.create!(title: "Section")
      section.form_items.create!(
        item_type: "free_text",
        identifier: "pitch",
        public_description: "Elevator pitch",
        properties: {
          "lines" => 1,
          "caption" => "Pitch"
        }
      )
      create(:event_proposal, convention:, event_category:, additional_info: { "pitch" => "A thrilling tale" })
    end

    before do
      %w[read_pending_event_proposals update_event_proposals].each do |permission|
        con_admin_staff_position.permissions.create!(model: convention, permission:)
      end
    end

    it "exports event proposals, including custom form items" do
      event_proposal

      get csv_exports_event_proposals_path, params: { columns: %w[title form_items.pitch] }

      assert_response :ok
      assert_equal [["Title", "Elevator pitch"], [event_proposal.title, "A thrilling tale"]], CSV.parse(response.body)
    end

    it "includes active filters in the filename" do
      event_proposal

      get csv_exports_event_proposals_path, params: { columns: %w[title], filters: { title: "thrill" } }

      assert_response :ok
      assert_match(/Title - thrill/, response.headers["Content-Disposition"])
    end
  end

  describe "GET orders" do
    it "exports non-pending orders" do
      user_con_profile = create(:user_con_profile, convention:, first_name: "Ann", last_name: "Aardvark")
      create(:order, user_con_profile:, status: "paid")
      create(:order, user_con_profile:, status: "pending")

      get csv_exports_orders_path, params: { columns: %w[user_name status] }

      assert_response :ok
      rows = CSV.parse(response.body)
      assert_equal 2, rows.size
      assert_equal %w[User Status], rows.first.values_at(1, 2)
      assert_equal ["Ann Aardvark", "paid"], rows.second.values_at(1, 2)
    end
  end

  describe "GET ranked_choice_decisions" do
    it "exports the decisions made in a signup round" do
      convention.update!(signup_automation_mode: "ranked_choice")
      signup_round = create(:signup_round, convention:)
      user_con_profile = create(:user_con_profile, convention:, first_name: "Zed", last_name: "Zebra")
      RankedChoiceDecision.create!(
        signup_round:,
        user_con_profile:,
        decision: "skip_user",
        reason: "no_pending_choices"
      )

      get csv_exports_ranked_choice_decisions_path,
          params: {
            signup_round_id: signup_round.id,
            columns: %w[user_con_profile_name decision],
            filters: {
              decision: ["SKIP_USER"],
              user_con_profile_name: "zebra"
            }
          }

      assert_response :ok
      assert_equal [%w[Attendee Decision], ["Zebra, Zed", "skip_user"]], CSV.parse(response.body)
    end
  end

  describe "GET run_signups" do
    it "exports a run's signups" do
      signup = create(:signup, run: signup_run)

      get csv_exports_run_signups_path, params: { run_id: signup_run.id, columns: %w[name state] }

      assert_response :ok
      assert_equal [%w[Name State], [signup.user_con_profile.name_inverted, "confirmed"]], CSV.parse(response.body)
      assert_match(/#{Regexp.escape(event.title)} Signups/, response.headers["Content-Disposition"])
    end
  end

  describe "GET run_signup_changes" do
    it "exports a run's signup change log" do
      signup = create(:signup, run: signup_run)
      signup.log_signup_change!(action: "self_service_signup")

      get csv_exports_run_signup_changes_path, params: { run_id: signup_run.id, columns: %w[action] }

      assert_response :ok
      assert_equal [%w[Action], %w[self_service_signup]], CSV.parse(response.body)
    end
  end

  describe "GET runs" do
    it "exports runs, including custom event form items exposed in the event catalog" do
      event_category = create(:event_category, convention:)
      section = event_category.event_form.form_sections.create!(title: "Section")
      section.form_items.create!(
        item_type: "free_text",
        identifier: "pitch",
        expose_in: ["event_catalog"],
        public_description: "Elevator pitch",
        properties: {
          "lines" => 1,
          "caption" => "Pitch"
        }
      )
      run_event = create(:event, convention:, event_category:, additional_info: { "pitch" => "A thrilling tale" })
      create(:run, event: run_event)

      get csv_exports_runs_path, params: { columns: %w[title form_items.pitch] }

      assert_response :ok
      assert_equal [["Title", "Elevator pitch"], [run_event.title, "A thrilling tale"]], CSV.parse(response.body)
    end

    it "exports without an explicit column list" do
      create(:run, event:)

      get csv_exports_runs_path

      assert_response :ok
      assert_equal 2, CSV.parse(response.body).size
    end
  end

  describe "GET user_con_profiles" do
    it "exports attendees" do
      create(:user_con_profile, convention:, first_name: "Ann", last_name: "Aardvark")

      get csv_exports_user_con_profiles_path, params: { columns: %w[name], filters: { name: "aardvark" } }

      assert_response :ok
      assert_equal [%w[Name], ["Aardvark, Ann"]], CSV.parse(response.body)
    end
  end

  describe "GET users" do
    it "exports users for site admins" do
      con_admin.update!(site_admin: true, first_name: "Sia", last_name: "Siteadmin")

      get "/csv_exports/users", params: { columns: %w[first_name], filters: { first_name: "sia" } }

      assert_response :ok
      assert_equal [["First name"], ["Sia"]], CSV.parse(response.body)
    end
  end
end

describe CsvExportsController::RunSignupsFilenameFinder do
  let(:finder) { CsvExportsController::RunSignupsFilenameFinder.new }
  let(:convention) { create(:convention) }
  let(:event) { create(:event, convention: convention) }

  describe "#unique_filename" do
    it "disambiguates runs by start day when they share a title" do
      run1 = create(:run, event: event, starts_at: convention.starts_at)
      create(:run, event: event, starts_at: convention.starts_at + 1.day)

      assert_equal(
        "#{event.title} (#{run1.starts_at.strftime("%a")}) Signups",
        finder.unique_filename(event, run1, "Signups")
      )
    end

    it "falls back to run IDs when nothing else distinguishes runs" do
      run1 = create(:run, event: event, starts_at: convention.starts_at)
      create(:run, event: event, starts_at: convention.starts_at)

      assert_equal "#{event.title} (run #{run1.id}) Signups", finder.unique_filename(event, run1, "Signups")
    end

    it "uses just the event title when the event has only one run" do
      run = create(:run, event: event, starts_at: convention.starts_at)

      assert_equal "#{event.title} Signups", finder.unique_filename(event, run, "Signups")
    end
  end
end
# rubocop:enable Metrics/BlockLength
