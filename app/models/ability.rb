class Ability
  include CanCan::Ability

  attr_reader :user

  # This class defines access controls.
  # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  def initialize(user)
    @user = user

    # All users, anonymous or otherwise, should be allowed to view Cons.
    can :read, Convention
    can [:read, :root], Page
    can [:read, :schedule], Event
    can :read, Form

    # Anonymous user permissions end here.
    return unless user

    if user.site_admin?
      # Site admins can do any action whatsoever.
      can :manage, :all
    else
      can [:read, :create, :update], UserConProfile, user_id: user.id
      can :create, EventProposal
      can [:read, :update], EventProposal, id: own_event_proposal_ids

      add_con_staff_abilities if staff_con_ids.any?
      add_team_member_abilities if team_member_event_ids.any?
    end
  end

  def attributes_for(action, subject)
    if [:new, :create].include?(action.to_sym) && subject == UserConProfile
      # attributes_for would normally try to assign the user_id of the current user here
      # (because we allow users to manage their own profiles).  We don't want that, since we allow admins to create
      # profiles for other users.
      {}
    else
      super
    end
  end

  private

  def add_con_staff_abilities
    can :manage, [Page, CmsPartial, CmsFile, CmsNavigationItem],
      parent_type: 'Convention', parent_id: staff_con_ids

    can :manage, Convention, id: staff_con_ids
    can :manage, UserConProfile, convention_id: staff_con_ids
    can :read, UserConProfile, convention_id: staff_con_ids
    can :manage, Ticket, user_con_profile: { convention_id: staff_con_ids }
    can :manage, TicketType, convention_id: staff_con_ids
    can :manage, Event, convention_id: staff_con_ids
    can :manage, Run, event: { convention_id: staff_con_ids }
    can :manage, Signup, run: { event: { convention_id: staff_con_ids } }
    can :manage, StaffPosition, convention_id: staff_con_ids
    can :manage, TeamMember, event: { convention_id: staff_con_ids }
    can :manage, Form, convention_id: staff_con_ids
    can :manage, EventProposal, convention_id: staff_con_ids, status: (EventProposal::STATUSES.to_a - ['draft'])
  end

  def add_team_member_abilities
    can :manage, Event, id: team_member_event_ids
    can :manage, EventProposal, event_id: team_member_event_ids
    can :manage, Run, event_id: team_member_event_ids
    can :manage, Signup, run: { event_id: team_member_event_ids }
    can :manage, TeamMember, event_id: team_member_event_ids
  end

  def staff_con_ids
    @staff_con_ids ||= begin
      staff_cons = Convention.joins(:user_con_profiles).where(user_con_profiles: { user_id: user.id, staff: true })
      staff_cons.pluck(:id)
    end
  end

  def team_member_event_ids
    @team_member_event_ids ||= begin
      team_member_events = Event.joins(team_members: :user_con_profile).where(user_con_profiles: { user_id: user.id })
      team_member_events.pluck(:id)
    end
  end

  def own_event_proposal_ids
    @own_event_proposal_ids ||= begin
      own_event_proposals = EventProposal.joins(:owner).where(user_con_profiles: { user_id: user.id })
      own_event_proposals.pluck(:id)
    end
  end
end
