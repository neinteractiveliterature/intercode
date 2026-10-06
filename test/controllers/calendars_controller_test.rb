# frozen_string_literal: true
require "test_helper"

describe CalendarsController do
  let(:convention) { create(:convention, name: "Test Con", timezone_name: "America/New_York") }
  let(:user_con_profile) do
    create(:user_con_profile, convention:, user: create(:user, first_name: "Alice", last_name: "Attendee"))
  end

  setup { set_convention convention }

  def get_schedule(profile = user_con_profile, secret: profile.ical_secret)
    get :user_schedule, params: { id: secret }
    response
  end

  def signup_to(
    event_title,
    state: "confirmed",
    title_suffix: nil,
    rooms: [],
    starts_at: convention.starts_at + 2.hours
  )
    event = create(:event, convention:, title: event_title, short_blurb: "About #{event_title}")
    run = create(:run, event:, starts_at:, title_suffix:)
    rooms.each { |name| run.rooms << create(:room, convention:, name:) }
    create(:signup, run:, user_con_profile:, state:, counted: state == "confirmed")
  end

  def calendar
    Icalendar::Calendar.parse(response.body).first
  end

  describe "GET user_schedule" do
    it "serves a calendar" do
      get_schedule

      assert_response :success
      assert_equal "text/calendar", response.media_type
      assert_not_nil calendar
    end

    it "names the calendar for the convention and the attendee" do
      get_schedule

      assert_equal "Test Con Schedule for Alice Attendee", calendar.x_wr_calname.first.to_s
    end

    it "includes the convention's timezone" do
      get_schedule

      assert_equal(["America/New_York"], calendar.timezones.map { |timezone| timezone.tzid.to_s })
    end

    it "has an event for each signup" do
      signup_to "First Game"
      signup_to "Second Game"

      get_schedule

      assert_equal ["First Game", "Second Game"], calendar.events.map { |event| event.summary.to_s }.sort
    end

    it "describes each event with its time, description and link to the event page" do
      signup = signup_to("First Game", starts_at: Time.utc(2016, 10, 28, 20, 0, 0))

      get_schedule

      event = calendar.events.first
      assert_equal signup.run.starts_at, event.dtstart.utc
      assert_equal signup.run.ends_at, event.dtend.utc
      assert_equal "America/New_York", event.dtstart.ical_params["tzid"].first
      assert_equal "About First Game", event.description.to_s
      assert_includes event.url.to_s, "/events/#{signup.event.to_param}"
      assert_includes event.url.to_s, convention.domain
    end

    it "marks waitlisted signups" do
      signup_to "Full Game", state: "waitlisted"

      get_schedule

      assert_equal "[WAITLISTED] Full Game", calendar.events.first.summary.to_s
    end

    it "adds a run's title suffix to the summary" do
      signup_to "Repeat Game", title_suffix: "Late Night"

      get_schedule

      assert_equal "Repeat Game (Late Night)", calendar.events.first.summary.to_s
    end

    it "lists the run's rooms" do
      signup_to "Roomy Game", rooms: %w[Salon Ballroom]

      get_schedule

      assert_equal %w[Ballroom Salon],
                   Array(calendar.events.first.location)
                     .flatten
                     .map(&:to_s)
                     .flat_map { |l| l.split(",").map(&:strip) }
                     .sort
    end

    it "leaves out signups that were withdrawn" do
      signup_to "Dropped Game", state: "withdrawn"
      signup_to "Kept Game"

      get_schedule

      assert_equal(["Kept Game"], calendar.events.map { |event| event.summary.to_s })
    end

    it "does not include other attendees' signups" do
      other = create(:user_con_profile, convention:)
      event = create(:event, convention:, title: "Somebody Else's Game")
      create(:signup, run: create(:run, event:), user_con_profile: other)

      get_schedule

      assert_empty calendar.events
    end

    it "is an empty calendar for someone with no signups" do
      get_schedule

      assert_response :success
      assert_empty calendar.events
    end

    it "does not need a login, just the secret in the address" do
      get_schedule

      assert_response :success
    end

    it "is not found with the wrong secret" do
      assert_raises(ActiveRecord::RecordNotFound) { get_schedule(secret: "not-the-secret") }
    end

    it "is not found at another convention with this attendee's secret" do
      other_convention = create(:convention)
      set_convention other_convention

      assert_raises(ActiveRecord::RecordNotFound) { get_schedule }
    end
  end
end
