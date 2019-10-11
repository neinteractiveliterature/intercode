module ScheduleRelease
  def has_schedule_release_permissions?(convention, schedule_release_value)
    case schedule_release_value
    when 'yes' then true
    when 'gms'
      has_convention_permission?(convention,
        'read_prerelease_schedule', 'read_limited_prerelease_schedule', 'update_events'
      ) ||
        team_member_in_convention?(convention)
    when 'priv'
      has_convention_permission?(convention,
        'read_limited_prerelease_schedule',
        'update_events'
      )
    else
      has_convention_permission?(convention, 'update_events')
    end
  end

  def conventions_with_schedule_release_permissions(schedule_release_field)
    Queries::DisjunctiveWhere.build(Convention.all) do |dw|
      dw.add(schedule_release_field => 'yes')
      dw.add(schedule_release_field => 'gms', id: conventions_where_team_member)
      dw.add(
        schedule_release_field => 'gms',
        id: conventions_with_permission(
          'read_prerelease_schedule', 'read_limited_prerelease_schedule'
        )
      )
      dw.add(
        schedule_release_field => 'priv',
        id: conventions_with_permission('read_limited_prerelease_schedule')
      )
      dw.add(id: conventions_with_permission('update_events'))
    end
  end
end
