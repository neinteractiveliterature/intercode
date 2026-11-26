# frozen_string_literal: true
class Queries::TeamMemberQueryManager < Queries::QueryManager
  def initialize(user:, authorization_info:)
    super(user: user)
    @authorization_info = authorization_info
    @user_con_profile_ids_for_team_member_in_convention_id = Queries::NilSafeCache.new
    @team_member_event_ids_in_convention_id = Queries::NilSafeCache.new
  end

  def team_member_in_convention?(convention)
    return false unless convention && user
    if @authorization_info.assumed_identity_from_profile &&
         @authorization_info.assumed_identity_from_profile.convention != convention
      return false
    end

    team_member_event_ids_in_convention_id(convention.id).any?
  end

  def team_member_for_event?(event)
    return false unless event && user
    if @authorization_info.assumed_identity_from_profile &&
         @authorization_info.assumed_identity_from_profile.convention != event.convention
      return false
    end

    team_member_event_ids_in_convention_id(event.convention_id).include?(event.id)
  end

  def team_member_for_user_con_profile?(user_con_profile)
    return false unless user_con_profile && user
    if @authorization_info.assumed_identity_from_profile &&
         @authorization_info.assumed_identity_from_profile.convention != user_con_profile.convention
      return false
    end

    user_con_profile_ids_for_team_member_in_convention_id(user_con_profile.convention_id).include?(user_con_profile.id)
  end

  def team_member_event_ids_in_convention_id(convention_id)
    return false unless convention_id && user
    if @authorization_info.assumed_identity_from_profile &&
         @authorization_info.assumed_identity_from_profile.convention.id != convention_id
      return false
    end

    @team_member_event_ids_in_convention_id.get(convention_id) do
      Set.new(events_where_team_member.where(convention_id: convention_id).pluck(:id))
    end
  end

  def conventions_where_team_member
    return Convention.none unless user

    scope =
      Convention.where(
        id: TeamMember.joins(:user_con_profile).where(user_con_profiles: { user_id: user.id }).select(:convention_id)
      )

    if @authorization_info.assumed_identity_from_profile
      scope = scope.where(id: @authorization_info.assumed_identity_from_profile.convention.id)
    end

    scope
  end

  def events_where_team_member
    return Event.none unless user

    scope =
      Event.where(
        id: TeamMember.joins(:user_con_profile).where(user_con_profiles: { user_id: user.id }).select(:event_id)
      )

    if @authorization_info.assumed_identity_from_profile
      scope = scope.where(convention_id: @authorization_info.assumed_identity_from_profile.convention.id)
    end

    scope
  end

  private

  # Every profile in the convention that is signed up for, or on the team of, one of my events.  Loaded all at
  # once because callers check this for each profile in a list.
  def user_con_profile_ids_for_team_member_in_convention_id(convention_id)
    @user_con_profile_ids_for_team_member_in_convention_id.get(convention_id) do
      my_events = events_where_team_member.where(convention_id:)
      signups = Signup.where(run: Run.where(event: my_events)).where.not(state: "withdrawn")

      Set.new(signups.pluck(:user_con_profile_id)).merge(TeamMember.where(event: my_events).pluck(:user_con_profile_id))
    end
  end
end
