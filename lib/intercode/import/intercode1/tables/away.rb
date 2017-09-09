class Intercode::Import::Intercode1::Tables::Away < Intercode::Import::Intercode1::Table
  include Intercode::Import::Intercode1::DateHelpers

  def initialize(connection, con, user_con_profile_id_map)
    super connection

    @con = con
    @user_con_profile_id_map = user_con_profile_id_map
  end

  def import!
    logger.info "Importing #{object_name.pluralize}"
    dataset.each do |row|
      logger.debug "Importing #{object_name} #{row_id(row)}"

      away_blocks = build_away_blocks(row)
      away_blocks.each(&:save!)
    end
  end

  private
  def build_away_blocks(row)
    user_con_profile = @user_con_profile_id_map[row[:UserId]]

    combine_timespans(build_hour_timespans(row)).map do |timespan|
      user_con_profile.away_blocks.new(timespan: timespan)
    end
  end

  def build_hour_timespans(row)
    row.map do |key, value|
      next unless key.to_s =~ /\A(Thu|Fri|Sat|Sun)(\d\d)\z/
      next unless value == 1

      day_start = start_of_convention_day(@con, $1)
      hour_start = day_start + $2.to_i.hours

      ScheduledValue::Timespan.new(start: hour_start, finish: hour_start + 1.hour)
    end.compact
  end

  def combine_timespans(timespans)
    timespans.sort_by(&:start).each_with_object([]) do |timespan, combined_timespans|
      last_timespan = combined_timespans.last

      if last_timespan && timespan.start == last_timespan.finish
        combined_timespans.pop
        combined_timespans << ScheduledValue::Timespan.new(start: last_timespan.start, finish: timespan.finish)
      else
        combined_timespans << timespan
      end
    end
  end

  def row_id(row)
    row[:AwayId]
  end
end
