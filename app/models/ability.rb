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

    # Anonymous user permissions end here.
    return unless user

    if user.site_admin?
      # Site admins can do any action whatsoever.
      can :manage, :all
    else
      can [:read, :create, :update], UserConProfile, user_id: user.id

      if staff_con_ids.any?
        can :manage, Convention, id: staff_con_ids
        can :manage, Page, parent: staff_con_ids
        can :manage, UserConProfile, convention_id: staff_con_ids
        can :read, UserConProfile, convention_id: staff_con_ids
        can :manage, Ticket, user_con_profile: { convention_id: staff_con_ids }
        can :manage, TicketType, convention_id: staff_con_ids
        can :manage, Event, convention_id: staff_con_ids
        can :manage, Run, event: { convention_id: staff_con_ids }
        can :manage, Signup, run: { event: { convention_id: staff_con_ids } }
      end

      if team_member_event_ids.any?
        can :manage, Event, id: team_member_event_ids
        can :manage, Run, event_id: team_member_event_ids
        can :manage, Signup, run: { event_id: team_member_event_ids }
        can :manage, TeamMember, event_id: team_member_event_ids
      end
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
end