class Intercode::Import::Intercode1::Tables::Runs < Intercode::Import::Intercode1::Table
  def initialize(connection, con, event_id_map, user_id_map, room_id_map)
    super connection
    @con = con
    @event_id_map = event_id_map
    @user_id_map = user_id_map
    @room_id_map = room_id_map
  end

  def dataset
    super.
      left_join(:RunsRooms, :RunId => :RunId).
      select_all(:Runs).
      select_append(Sequel.lit("GROUP_CONCAT(RunsRooms.RoomId)").as(:RoomIds)).
      group_by(:RunId)
  end

  private
  def build_record(row)
    event = @event_id_map[row[:EventId]]
    return unless event

    event.runs.new(
      starts_at: start_time(row),
      title_suffix: row[:TitleSuffix],
      schedule_note: row[:ScheduleNote],
      rooms: rooms(row),
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

  def friday_start
    @friday_start ||= begin
      starts_at = @con.starts_at.in_time_zone(@con.timezone)

      if starts_at.friday?
        starts_at.beginning_of_day
      elsif starts_at.thursday?
        (starts_at.beginning_of_day + 1.day)
      end
    end
  end

  def start_time(row)
    friday_start + day_offset(row).days + row[:StartHour].hours
  end

  def rooms(row)
    room_ids = (row[:RoomIds] || '').split(",").map(&:to_i)
    room_ids.map { |id| @room_id_map[id] }
  end
end
