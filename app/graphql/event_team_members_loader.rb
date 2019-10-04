class EventTeamMembersLoader < GraphQL::Batch::Loader
  attr_reader :pundit_user

  def initialize(pundit_user)
    @pundit_user = pundit_user
  end

  def perform(keys)
    team_member_scope = TeamMemberPolicy::Scope.new(
      pundit_user,
      TeamMember.includes(event: [:convention], user_con_profile: [:team_members]).where(event_id: keys.map(&:id))
    ).resolve

    team_members_by_event_id = team_member_scope.to_a.group_by(&:event_id)
    keys.each do |event|
      fulfill(event, team_members_by_event_id[event.id] || [])
    end
  end
end
