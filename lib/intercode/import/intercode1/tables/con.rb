class Intercode::Import::Intercode1::Tables::Con < Intercode::Import::Intercode1::Table
  def initialize(connection, con_name, con_domain, friday_date, timezone_name="US/Eastern")
    super(connection)
    @con_name = con_name
    @con_domain = con_domain

    timezone = ActiveSupport::TimeZone[timezone_name]
    @starts_at = Time.new(friday_date.year, friday_date.month, friday_date.day, 0, 0, 0, timezone.formatted_offset)
  end

  def build_con
    build_record(dataset.first)
  end

  private
  def build_record(row)
    Convention.new(
      name: @con_name,
      domain: @con_domain,
      signups_allowed: row[:SignupsAllowed].underscore,
      show_schedule: row[:ShowSchedule].underscore,
      news: row[:News],
      con_com_meetings: row[:ConComMeetings],
      accepting_bids: yesno_to_bool(row[:AcceptingBids]),
      precon_bids_allowed: yesno_to_bool(row[:PreconBidsAllowed]),
      starts_at: @starts_at
    )
  end
end