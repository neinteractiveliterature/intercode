require 'icalendar/tzinfo'

class CalendarsController < ApplicationController
  include AbsoluteUrls

  def user_schedule
    user_con_profile = convention.user_con_profiles.find_by!(ical_secret: params[:id])

    cal = build_user_schedule_calendar(user_con_profile)
    cal.publish
    response.content_type = 'text/calendar'
    render plain: cal.to_ical
  end

  private

  def build_user_schedule_calendar(user_con_profile)
    cal = Icalendar::Calendar.new
    cal.x_wr_calname = "#{convention.name} Schedule for #{user_con_profile.name_without_nickname}"
    tzid = convention.timezone_name || 'Etc/UTC'
    set_timezone_metadata(cal, tzid)

    signups = user_con_profile.signups.where.not(state: 'withdrawn').includes(run: :event)
    signups.each do |signup|
      cal.event do |e|
        set_event_properties_from_signup(e, signup, tzid)
      end
    end

    cal
  end

  def set_timezone_metadata(cal, tzid)
    tz = TZInfo::Timezone.get(tzid)
    timezone = tz.ical_timezone convention.starts_at
    cal.add_timezone timezone
  end

  def set_event_properties_from_signup(event, signup, tzid)
    event.dtstart = Icalendar::Values::DateTime.new(signup.run.starts_at.in_time_zone(tzid), 'tzid' => tzid)
    event.dtend = Icalendar::Values::DateTime.new(signup.run.ends_at.in_time_zone(tzid), 'tzid' => tzid)
    event.summary = event_summary_from_signup(signup)
    event.location = event_location_from_signup(signup)
    event.description = signup.event.short_blurb
    event.url = url_with_convention_host(
      "/events/#{signup.event.to_param}",
      signup.event.convention
    )
  end

  def event_summary_from_signup(signup)
    [
      signup.waitlisted? ? '[WAITLISTED] ' : '',
      signup.run.event.title,
      signup.run.title_suffix.present? ? " (#{signup.run.title_suffix})" : ''
    ].join('')
  end

  def event_location_from_signup(signup)
    signup.run.rooms.map(&:name).sort.presence
  end
end
