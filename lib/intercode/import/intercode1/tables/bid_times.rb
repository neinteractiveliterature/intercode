class Intercode::Import::Intercode1::Tables::BidTimes < Intercode::Import::Intercode1::Table
  WDAY_MAP = {
    'Sunday' => 0,
    'Monday' => 1,
    'Tuesday' => 2,
    'Wednesday' => 3,
    'Thursday' => 4,
    'Friday' => 5,
    'Saturday' => 6
  }

  def initialize(connection, convention, event_proposals_id_map)
    super connection

    @convention = convention
    @event_proposals_id_map = event_proposals_id_map
  end

  def import!
    form_item_identifier = timeblock_preference_form_item.identifier

    logger.info "Importing #{object_name.pluralize}"
    dataset.each do |row|
      logger.debug "Importing #{object_name} #{row_id(row)}"
      event_proposal = @event_proposals_id_map[row[:BidId]]
      next unless row[:Pref].present?

      timeblock_preference = build_timeblock_preference(row)
      current_preferences = event_proposal.read_form_response_attribute(
        form_item_identifier
      )

      event_proposal.assign_form_response_attributes(
        form_item_identifier => (current_preferences || []) + [timeblock_preference]
      )
      event_proposal.save!
    end
  end

  private

  def row_id(row)
    row[:BidTimeId]
  end

  def timeblock_preference_form_item
    @timeblock_preference_form_item ||= (
      @convention.event_proposal_form.form_items.find_by!(identifier: 'timeblock_preferences')
    )
  end

  def beginning_of_convention_day(day)
    convention_start = @convention.starts_at.in_time_zone(@convention.timezone)
    relative_day = (WDAY_MAP[day] - convention_start.wday) % 7
    convention_start.beginning_of_day + relative_day.days
  end

  def timeblock_definition(slot)
    timeblock_preference_form_item.properties['timeblocks'].find do |timeblock|
      timeblock['label'] == slot
    end
  end

  def calculate_timeblock_time(day_start, time_hash)
    current_time = day_start.dup

    time_hash.each do |key, value|
      time_change = case key.to_s
      when 'hour' then value.hours
      when 'minute' then value.minutes
      when 'second' then value.seconds
      end

      current_time += time_change
    end

    current_time
  end

  def build_timeblock_preference(row)
    day_start = beginning_of_convention_day(row[:Day])
    timeblock = timeblock_definition(row[:Slot])

    {
      start: calculate_timeblock_time(day_start, timeblock['start']),
      finish: calculate_timeblock_time(day_start, timeblock['finish']),
      label: row[:Slot],
      ordinality: row[:Pref]
    }
  end
end
