# frozen_string_literal: true
class Sources::RunRoomNames < GraphQL::Dataloader::Source
  def fetch(keys)
    room_data = Room.joins(:runs).where(runs: { id: keys.map(&:id) }).pluck("rooms_runs.run_id", :name)

    room_names_by_run_id =
      room_data.each_with_object({}) do |(run_id, room_name), hash|
        hash[run_id] ||= []
        hash[run_id] << room_name
      end

    keys.map { |run| room_names_by_run_id[run.id] || [] }
  end
end
