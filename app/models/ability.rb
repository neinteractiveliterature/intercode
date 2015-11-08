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

    if user.site_admin?
      # Site admins can do any action whatsoever.
      can :manage, :all
    else
      can :manage, Convention, :user_con_profiles => { :user_id => user.id, :staff => true }
      can :manage, Page, :parent => { :user_con_profiles => { :user_id => user.id, :staff => true } }
    end
  end
end