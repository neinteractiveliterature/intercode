class Intercode::Import::Intercode1::Tables::Runs < Intercode::Import::Intercode1::Table
  def initialize(connection, con, event_id_map, user_id_map)
    super connection
    @con = con
    @event_id_map = event_id_map
    @user_id_map = user_id_map
  end

  private
  def build_record(row)
    event = @event_id_map[row[:EventId]]

    event.runs.new(
      starts_at: start_time(row),
      title_suffix: row[:TitleSuffix],
      schedule_note: row[:ScheduleNote],
      updated_by: @user_id_map[row[:UpdatedById]]
    )
  end

  def row_id(row)
    row[:RunId]
  end

  def day_offset(row)
    case row[:Day]
    when 'Thu' then -1
    when 'Fri' then 0
    when 'Sat' then 1
    when 'Sun' then 2
    end
  end

  def start_time(row)
    @con.starts_at + day_offset(row).days + row[:StartHour].hours
  end
end