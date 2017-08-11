class Intercode::Import::Intercode1::Tables::Con < Intercode::Import::Intercode1::Table
  def initialize(connection, con_name, con_domain, friday_date, constants_file, timezone_name, thursday_enabled)
    super(connection)
    @con_name = con_name
    @con_domain = con_domain
    @constants_file = constants_file

    @timezone = ActiveSupport::TimeZone[timezone_name]
    friday_start = @timezone.local(
      friday_date.year,
      friday_date.month,
      friday_date.day,
      0,
      0,
      0,
    )

    if thursday_enabled
      @starts_at = (friday_start - 1.day).beginning_of_day.change(hour: 18)
    else
      @starts_at = friday_start
    end

    @ends_at = (friday_start + 2.days).beginning_of_day.change(hour: 15)

    @row = dataset.first
  end

  def build_con
    build_record(@row)
  end

  def update_cms_content(con)
    file_root = File.dirname(@constants_file)

    news_content = Intercode::Import::Intercode1::HtmlConverter.new(
      html: @row[:News],
      convention: con,
      file_root: file_root
    ).convert

    con_com_meetings_content = Intercode::Import::Intercode1::HtmlConverter.new(
      html: @row[:ConComMeetings],
      convention: con,
      file_root: file_root
    ).convert

    con.cms_partials.find_by!(name: 'news').update!(content: news_content)
    con.pages.create!(name: 'ConCom Schedule', content: con_com_meetings_content)
  end

  private
  def build_record(row)
    Convention.new(
      name: @con_name,
      domain: @con_domain,
      signups_allowed: row[:SignupsAllowed].underscore,
      show_schedule: row[:ShowSchedule].underscore,
      accepting_bids: yesno_to_bool(row[:AcceptingBids]),
      precon_bids_allowed: yesno_to_bool(row[:PreconBidsAllowed]),
      starts_at: @starts_at,
      ends_at: @ends_at,
      timezone_name: @timezone.name,
      maximum_event_signups: {
        timespans: [
          {
            start: nil,
            finish: nil,
            value: 'unlimited'
          }
        ]
      }
    )
  end
end
