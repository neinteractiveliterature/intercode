class EventTeamMembersLoader < GraphQL::Batch::Loader
  attr_reader :pundit_user

  def initialize(pundit_user)
    @pundit_user = pundit_user
  end

  def perform(keys)
    team_member_scope = TeamMember.includes(event: [:convention], user_con_profile: [:team_members, :convention])
      .where(event_id: keys.map(&:id))

    team_members_by_event_id = team_member_scope.to_a.group_by(&:event_id)
    keys.each do |event|
      readable_team_members = (team_members_by_event_id[event.id] || []).select do |team_member|
        TeamMemberPolicy.new(pundit_user, team_member).read?
      end
      fulfill(event, readable_team_members)
    end
  end
end
