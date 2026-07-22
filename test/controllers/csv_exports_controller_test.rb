# frozen_string_literal: true
# rubocop:disable Metrics/BlockLength
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

    it "uses just the event title when the event has only one run" do
      run = create(:run, event: event, starts_at: convention.starts_at)

      assert_equal "#{event.title} Signups", finder.unique_filename(event, run, "Signups")
    end
  end
end
# rubocop:enable Metrics/BlockLength
