# frozen_string_literal: true
class RunRoomNamesLoader < GraphQL::Batch::Loader
  def perform(keys)
    room_data = Room.joins(:runs).where(runs: { id: keys.map(&:id) }).pluck('rooms_runs.run_id', :name)

    room_names_by_run_id =
      room_data.each_with_object({}) do |(run_id, room_name), hash|
        hash[run_id] ||= []
        hash[run_id] << room_name
      end

    keys.each { |run| fulfill(run, room_names_by_run_id[run.id] || []) }
  end
end
