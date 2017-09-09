module Intercode::Import::Intercode1::DateHelpers
  def day_offset_from_short_day_name(short_day_name)
    case short_day_name
    when 'Thu' then -1
    when 'Fri' then 0
    when 'Sat' then 1
    when 'Sun' then 2
    end
  end

  def friday_start(con)
    @friday_start ||= begin
      starts_at = con.starts_at.in_time_zone(con.timezone)

      if starts_at.friday?
        starts_at.beginning_of_day
      elsif starts_at.thursday?
        (starts_at.beginning_of_day + 1.day)
      end
    end
  end

  def start_of_convention_day(con, short_day_name)
    friday_start(con) + day_offset_from_short_day_name(short_day_name).days
  end
end
