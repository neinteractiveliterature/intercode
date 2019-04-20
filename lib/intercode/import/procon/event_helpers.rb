module Intercode::Import::Procon::EventHelpers
  def force_timezone(time, timezone_name)
    zone = ActiveSupport::TimeZone[timezone_name]
    zone.parse(time.strftime('%Y-%m-%d %H:%M:%S'))
  end

  def descriptive_content(row)
    return row[:blurb] if row[:description].blank?
    return row[:description] if row[:blurb].blank?

    <<~HTML
      <h2>Blurb</h2>

      <div>
        #{row[:blurb]}
      </div>

      <h2>Description</h2>

      <div>
        #{row[:description]}
      </div>
    HTML
  end

  def event_registration_open?(row)
    connection[:registration_rules]
      .where(type: 'ClosedEventRule', policy_id: row[:registration_policy_id])
      .count == 0
  end

  def can_play_concurrently?(row)
    connection[:registration_rules].where(
      policy_id: row[:registration_policy_id],
      type: 'ExclusiveEventRule'
    ).count == 0
  end

  def age_restrictions(row)
    rule = connection[:registration_rules].where(
      policy_id: row[:registration_policy_id],
      type: 'AgeRestrictionRule'
    ).first
    return unless rule

    "Must be at least #{rule[:min_age]} years old"
  end
end
