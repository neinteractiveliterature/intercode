class Intercode::Import::Intercode1::Tables::Runs < Intercode::Import::Intercode1::Table
  include Intercode::Import::Intercode1::DateHelpers

  def initialize(connection, con, event_id_map, user_id_map, room_id_map)
    super connection
    @con = con
    @event_id_map = event_id_map
    @user_id_map = user_id_map
    @room_id_map = room_id_map
  end

  def dataset
    if connection.table_exists?(:RunsRooms)
      super
        .left_join(:RunsRooms, RunId: :RunId)
        .select_all(:Runs)
        .select_append(Sequel.lit('GROUP_CONCAT(RunsRooms.RoomId)').as(:RoomIds))
        .group_by(:RunId)
    else
      super
    end
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

  def start_time(row)
    start_of_convention_day(@con, row[:Day]) + row[:StartHour].hours
  end

  def rooms(row)
    if connection.table_exists?(:RunsRooms)
      (row[:RoomIds] || '').split(',').map(&:to_i)
      room_ids.map { |id| @room_id_map[id] }
    else
      (row[:Rooms] || '').split(',').map { |room_name| @room_id_map[room_name] }
    end
  end
end
