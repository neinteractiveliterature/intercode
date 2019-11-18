class Queries::TeamMemberQueryManager < Queries::QueryManager
  def initialize(**_args)
    @team_member_in_convention = Queries::NilSafeCache.new
    @team_member_for_event = Queries::NilSafeCache.new
    @team_member_for_user_con_profile = Queries::NilSafeCache.new
  end

  def team_member_in_convention?(convention)
    return false unless convention && user

    @team_member_in_convention.get(convention.id) do
      TeamMember.joins(:user_con_profile)
        .where(user_con_profiles: { user_id: user.id, convention_id: convention.id })
        .any?
    end
  end

  def team_member_for_event?(event)
    return false unless event && user

    @team_member_for_event.get(event.id) do
      TeamMember.joins(:user_con_profile)
        .where(user_con_profiles: { user_id: user.id }, event_id: event.id)
        .any?
    end
  end

  def team_member_for_user_con_profile?(user_con_profile)
    return false unless user_con_profile && user

    @team_member_for_user_con_profile.get(user_con_profile.id) do
      (
        Signup
          .where(
            run: Run.where(
              event: events_where_team_member
            ),
            user_con_profile_id: user_con_profile.id
          )
          .where.not(state: 'withdrawn')
          .any?
      ) ||
        (
          TeamMember
            .where(event: events_where_team_member, user_con_profile: user_con_profile.id)
            .any?
        )
    end
  end

  def conventions_where_team_member
    return Convention.none unless user

    Convention.where(
      id: TeamMember
        .joins(:user_con_profile)
        .where(user_con_profiles: { user_id: user.id })
        .select(:convention_id)
    )
  end

  def events_where_team_member
    return Event.none unless user

    Event.where(
      id: TeamMember.joins(:user_con_profile)
        .where(user_con_profiles: { user_id: user.id })
        .select(:event_id)
    )
  end
end
