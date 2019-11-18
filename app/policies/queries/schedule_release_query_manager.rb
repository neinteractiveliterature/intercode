class Queries::ScheduleReleaseQueryManager < Queries::QueryManager
  def initialize(user:, authorization_info:)
    super(user: user)
    @authorization_info = authorization_info
    @has_schedule_release_permissions = Queries::NilSafeCache.new
  end

  def has_schedule_release_permissions?(convention, schedule_release_value)
    @has_schedule_release_permissions.get([convention.id, schedule_release_value]) do
      case schedule_release_value
      when 'yes' then true
      when 'gms'
        @authorization_info.has_convention_permission?(convention,
          'read_prerelease_schedule', 'read_limited_prerelease_schedule', 'update_events'
        ) ||
          @authorization_info.team_member_in_convention?(convention)
      when 'priv'
        @authorization_info.has_convention_permission?(convention,
          'read_limited_prerelease_schedule',
          'update_events'
        )
      else
        @authorization_info.has_convention_permission?(convention, 'update_events')
      end
    end
  end

  def conventions_with_schedule_release_permissions(schedule_release_field)
    Queries::DisjunctiveWhere.build(Convention.all) do |dw|
      dw.add(schedule_release_field => 'yes')
      dw.add(schedule_release_field => 'gms', id: @authorization_info.conventions_where_team_member)
      dw.add(
        schedule_release_field => 'gms',
        id: @authorization_info.conventions_with_permission(
          'read_prerelease_schedule', 'read_limited_prerelease_schedule'
        )
      )
      dw.add(
        schedule_release_field => 'priv',
        id: @authorization_info.conventions_with_permission('read_limited_prerelease_schedule')
      )
      dw.add(id: @authorization_info.conventions_with_permission('update_events'))
    end
  end
end
