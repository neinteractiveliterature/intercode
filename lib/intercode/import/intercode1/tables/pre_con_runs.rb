class Intercode::Import::Intercode1::Tables::PreConRuns < Intercode::Import::Intercode1::Table
  include Intercode::Import::Intercode1::DateHelpers

  def initialize(connection, con, pre_con_event_id_map)
    super connection
    @con = con
    @pre_con_event_id_map = pre_con_event_id_map
  end

  private

  def build_record(row)
    event = @pre_con_event_id_map[row[:PreConEventId]]
    return unless event

    event.runs.new(
      starts_at: start_time(row),
      title_suffix: row[:TitleSuffix],
      schedule_note: row[:ScheduleNote],
      rooms: rooms(row)
    )
  end

  def row_id(row)
    row[:PreConRunId]
  end

  def start_time(row)
    start_hour = row[:StartHour]
    start_hour = start_hour.to_i if start_hour.is_a?(String)
    start_of_convention_day(@con, row[:Day]) + start_hour.hours
  end

  def rooms(row)
    @con.rooms.where(name: (row[:Rooms] || '').split(',').map(&:strip)).to_a
  end
end
