# frozen_string_literal: true
class Queries::TeamMemberQueryManager < Queries::QueryManager
  def initialize(user:)
    super(user: user)
    @team_member_for_user_con_profile = Queries::NilSafeCache.new
    @team_member_event_ids_in_convention_id = Queries::NilSafeCache.new
  end

  def team_member_in_convention?(convention)
    return false unless convention && user

    team_member_event_ids_in_convention_id(convention.id).any?
  end

  def team_member_for_event?(event)
    return false unless event && user

    team_member_event_ids_in_convention_id(event.convention_id).include?(event.id)
  end

  def team_member_for_user_con_profile?(user_con_profile)
    return false unless user_con_profile && user

    @team_member_for_user_con_profile.get(user_con_profile.id) do
      
        Signup
          .where(run: Run.where(event: events_where_team_member), user_con_profile_id: user_con_profile.id)
          .where.not(state: 'withdrawn')
          .any?
       || TeamMember.where(event: events_where_team_member, user_con_profile: user_con_profile.id).any?
    end
  end

  def team_member_event_ids_in_convention_id(convention_id)
    return false unless convention_id && user

    @team_member_event_ids_in_convention_id.get(convention_id) do
      Set.new(events_where_team_member.where(convention_id: convention_id).pluck(:id))
    end
  end

  def conventions_where_team_member
    return Convention.none unless user

    Convention.where(
      id: TeamMember.joins(:user_con_profile).where(user_con_profiles: { user_id: user.id }).select(:convention_id)
    )
  end

  def events_where_team_member
    return Event.none unless user

    Event.where(
      id: TeamMember.joins(:user_con_profile).where(user_con_profiles: { user_id: user.id }).select(:event_id)
    )
  end
end
