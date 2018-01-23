class Ability
  EVENT_PROPOSAL_NON_DRAFT_STATUSES = EventProposal::STATUSES.to_a - ['draft']

  include CanCan::Ability

  attr_reader :user

  # This class defines access controls.
  # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  def initialize(user)
    @user = user

    # Here's what the general public can do...
    can :read, Convention
    can [:read, :root], Page
    can :read, Form
    can :read, Event, status: 'active'
    can :schedule, Convention, show_schedule: 'yes'

    # Anonymous user permissions end here.
    return unless user

    if user.site_admin?
      # Site admins can do any action whatsoever.
      can :manage, :all
    else
      can [:read, :create, :update], UserConProfile, user_id: user.id
      can :create, EventProposal
      can [:read, :update], EventProposal, id: own_event_proposal_ids
      can :signup_summary, Run, id: signed_up_run_ids

      add_con_staff_abilities
      add_event_proposal_abilities
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
    can :manage, [Page, CmsPartial, CmsFile, CmsNavigationItem, CmsLayout],
      parent_type: 'Convention', parent_id: staff_con_ids

    can :update, Convention, id: staff_con_ids
    can :view_reports, Convention, id: con_ids_with_privilege(:con_com)

    # Mail privileges (smash the patriarchy)
    can :mail_to_any, Convention, id: con_ids_with_privilege(*UserConProfile::MAIL_PRIV_NAMES)
    UserConProfile::MAIL_PRIV_NAMES.each do |mail_priv_name|
      can mail_priv_name.to_sym, Convention, id: con_ids_with_privilege(mail_priv_name)
    end

    can [:schedule, :schedule_with_counts], Convention, id: con_ids_with_privilege(:scheduling, :gm_liaison), show_schedule: %w(priv gms yes)
    can [:schedule, :schedule_with_counts], Convention, id: con_ids_with_privilege(:con_com), show_schedule: %w(gms yes)
    can :manage, UserConProfile, convention_id: staff_con_ids
    can :read, UserConProfile, convention_id: con_ids_with_privilege(:con_com)
    can :manage, Ticket, user_con_profile: { convention_id: staff_con_ids }
    can :manage, TicketType, convention_id: staff_con_ids
    can :manage, Event, convention_id: con_ids_with_privilege(:proposal_chair, :gm_liaison, :scheduling)
    can :manage, Run, event: { convention_id: con_ids_with_privilege(:gm_liaison, :scheduling) }
    can :read, Signup, run: { event: { convention_id: con_ids_with_privilege(:outreach) } }
    can :manage, Signup, run: { event: { convention_id: staff_con_ids } }
    can :manage, StaffPosition, convention_id: staff_con_ids
    can :manage, TeamMember, event: { convention_id: con_ids_with_privilege(:gm_liaison) }
    can :manage, Form, convention_id: staff_con_ids
    can :manage, Room, convention_id: con_ids_with_privilege(:gm_liaison, :scheduling)
  end

  def add_event_proposal_abilities
    can :read, EventProposal, convention_id: con_ids_with_privilege(:proposal_committee, :gm_liaison), status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
    can :manage, EventProposal, convention_id: con_ids_with_privilege(:proposal_chair), status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
    can :update, EventProposal, convention_id: con_ids_with_privilege(:gm_liaison), status: ['accepted', 'withdrawn']
  end

  def add_team_member_abilities
    can :update, Event, id: team_member_event_ids
    can :schedule, Convention, id: team_member_convention_ids, show_schedule: %w(gms yes)
    can :update, EventProposal, event_id: team_member_event_ids
    can :read, Signup, run: { event_id: team_member_event_ids }
    can :manage, TeamMember, event_id: team_member_event_ids
  end

  def con_ids_with_privilege(*privileges)
    @con_ids_by_privilege ||= begin
      con_ids_with_privileges = UserConProfile.where(user_id: user.id).flat_map do |user_con_profile|
        user_con_profile.privileges.map { |privilege| [user_con_profile.convention_id, privilege] }
      end

      con_ids_with_privileges
        .group_by { |(_, privilege)| privilege }
        .transform_values { |privilege_tuples| privilege_tuples.map { |(convention_id, _)| convention_id } }
    end

    (privileges + ['staff']).uniq.flat_map do |privilege|
      @con_ids_by_privilege[privilege.to_s] || []
    end.uniq
  end

  def staff_con_ids
    con_ids_with_privilege(:staff)
  end

  def team_member_event_ids_and_convention_ids
    @team_member_event_ids_and_convention_ids ||= begin
      team_member_events = Event.joins(team_members: :user_con_profile).where(user_con_profiles: { user_id: user.id })
      team_member_events.pluck(:id, :convention_id)
    end
  end

  def team_member_event_ids
    @team_member_event_ids ||= team_member_event_ids_and_convention_ids.map(&:first)
  end

  def team_member_convention_ids
    @team_member_convention_ids ||= team_member_event_ids_and_convention_ids.map(&:second).uniq
  end

  def signed_up_run_ids
    @signed_up_event_ids ||= Signup.joins(:user_con_profile)
      .where(user_con_profiles: { user_id: user.id }, state: %w(confirmed waitlisted))
      .pluck(:run_id)
  end

  def own_event_proposal_ids
    @own_event_proposal_ids ||= begin
      own_event_proposals = EventProposal.joins(:owner).where(user_con_profiles: { user_id: user.id })
      own_event_proposals.pluck(:id)
    end
  end
end
