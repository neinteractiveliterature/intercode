class Ability
  include CanCan::Ability

  # This class defines access controls.
  # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  def initialize(user)

    # All users, anonymous or otherwise, should be allowed to view Cons.
    can :read, Convention
    can [:read, :root], Page
    can [:read, :schedule], Event

    # Anonymous user permissions end here.
    return unless user

    # Anyone can buy a ticket.
    can :new, Ticket
    can :create, Ticket, { user_con_profile: { user_id: user.id } }

    if user.site_admin?
      # Site admins can do any action whatsoever.
      can :manage, :all
    else
      can :manage, Convention, :user_con_profiles => { :user_id => user.id, :staff => true }
      can :manage, Page, :parent => { :user_con_profiles => { :user_id => user.id, :staff => true } }
      can :manage, UserConProfile, convention: { user_con_profiles: { user_id: user.id, staff: true } }
      can :read, UserConProfile, convention: { user_con_profiles: { user_id: user.id, con_com: true } }
      can :manage, Ticket, convention: { user_con_profiles: { user_id: user.id, staff: true } }

      can :manage, Event, convention: { user_con_profiles: { user_id: user.id, staff: true } }
      can :manage, Event, team_members: { user_id: user.id }
      can :manage, TeamMember, event: { team_members: { user_id: user.id } }
    end
  end
end