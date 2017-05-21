class Intercode::Import::Intercode1::Tables::Con < Intercode::Import::Intercode1::Table
  def initialize(connection, con_name, con_domain, friday_date, timezone_name="US/Eastern")
    super(connection)
    @con_name = con_name
    @con_domain = con_domain

    @timezone = ActiveSupport::TimeZone[timezone_name]
    @starts_at = Time.new(friday_date.year, friday_date.month, friday_date.day, 0, 0, 0, @timezone.formatted_offset)

    @row = dataset.first
  end

  def build_con
    build_record(@row)
  end

  def update_cms_content(con)
    con.cms_partials.find_by!(name: 'news').update!(content: @row[:News])
    con.pages.create!(name: 'con_com_schedule', content: @row[:ConComMeetings])
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