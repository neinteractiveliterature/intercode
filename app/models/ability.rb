class Ability
  EVENT_PROPOSAL_NON_DRAFT_STATUSES = EventProposal::STATUSES.to_a - ['draft']

  include CanCan::Ability

  attr_reader :user, :doorkeeper_token, :associated_records_loader

  # This class defines access controls.
  # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  def initialize(user, doorkeeper_token, associated_records_loader: nil)
    alias_action :export, to: :read

    @user = user
    @doorkeeper_token = doorkeeper_token
    @associated_records_loader = associated_records_loader
    @associated_records_loader ||= Ability::AssociatedRecordsLoader.new([user&.id].compact)

    add_public_abilities

    # Anonymous user permissions end here.
    return unless user

    add_authenticated_user_abilities

    if user.site_admin?
      add_site_admin_abilities
    else
      add_con_staff_abilities
      add_event_proposal_abilities
      add_team_member_abilities if team_member_event_ids.any?
    end
  end

  def attributes_for(action, subject)
    if [:new, :create].include?(action.to_sym) && subject == UserConProfile
      # attributes_for would normally try to assign the user_id of the current user here
      # (because we allow users to manage their own profiles).  We don't want that, since we allow
      # admins to create profiles for other users.
      {}
    else
      super
    end
  end

  %i[
    own_event_proposal_ids
    signed_up_run_ids
    staff_con_ids
    team_member_event_ids
    team_member_convention_ids
    team_member_signed_up_user_con_profile_ids
    con_ids_with_privilege
  ].each do |method_name|
    define_method method_name do |*args|
      associated_records_loader.public_send(method_name, user.id, *args)
    end
  end

  def hash
    user.hash
  end

  def eql?(other)
    other.is_a?(Ability) && other.user == user
  end

  def ==(other)
    eql?(other)
  end

  private

  def has_scope?(scope)
    doorkeeper_token.nil? || doorkeeper_token.scopes.exists?(scope)
  end

  def add_public_abilities
    # Here's what the general public can do...
    can :read, Convention
    can :schedule, Convention, show_schedule: 'yes'
    can :read, Event, status: 'active'
    can :read, Form
    can [:read, :root], Page
    can :read, Product
    can :read, Room
    can :read, Run, event: { status: 'active', convention: { show_schedule: 'yes' } }
    can :read, StaffPosition
    can :read, TicketType
  end

  def add_site_admin_abilities
    # only allow managing OAuth apps via actual cookie session
    can :manage, Doorkeeper::Application unless doorkeeper_token

    can :read, [Event, Run, Signup] if has_scope?(:read_signups)
    can :signup_summary, Run

    if has_scope?(:read_events)
      can :read, [
        Event,
        EventProposal,
        MaximumEventProvidedTicketsOverride,
        Run,
        Signup,
        TeamMember
      ]
    end

    if has_scope?(:read_conventions)
      can [
        :mail_to_any,
        :schedule,
        :schedule_with_counts,
        :view_reports,
        :view_attendees
      ], Convention
      can :read, [Order, OrderEntry, Ticket, UserConProfile, User, UserActivityAlert]
      can :read_personal_info, UserConProfile
    end

    can :manage, [Event, Run, Signup] if has_scope?(:manage_signups)

    if has_scope?(:manage_events)
      can :manage, [
        Event,
        EventProposal,
        MaximumEventProvidedTicketsOverride,
        Run,
        Signup,
        TeamMember
      ]
    end

    return unless has_scope?(:manage_conventions)
    can :manage, [
      CmsFile,
      CmsLayout,
      CmsNavigationItem,
      CmsPartial,
      CmsVariable,
      Convention,
      Form,
      Page,
      Product,
      Room,
      Order,
      OrderEntry,
      StaffPosition,
      Ticket,
      TicketType,
      UserActivityAlert,
      UserConProfile
    ]
  end

  def add_authenticated_user_abilities
    can :read, UserConProfile, user_id: user.id
    can :revert_become, UserConProfile

    if has_scope?(:read_profile)
      can :read_personal_info, UserConProfile, user_id: user.id
      can :read, Order, user_con_profile: { user_id: user.id }
    end

    if has_scope?(:manage_profile)
      can [:create, :update], UserConProfile, user_id: user.id
      can :submit, Order, user_con_profile: { user_id: user.id }, status: %w[pending unpaid]
      can :manage, OrderEntry, order: { user_con_profile: { user_id: user.id }, status: 'pending' }
      can :read, Ticket, user_con_profile: { user_id: user.id }
    end

    if has_scope?(:read_events)
      can :read, EventProposal, id: own_event_proposal_ids
      can :read, EventProposal, owner: { user_id: user.id }
      can :signup_summary, Run, id: signed_up_run_ids
      can :read, TeamMember, user_con_profile: { user_id: user.id }
    end

    if has_scope?(:manage_events)
      can [:create, :submit], EventProposal
      can :update, EventProposal,
        id: own_event_proposal_ids,
        status: %w[draft proposed reviewing]
      can :destroy, EventProposal, id: own_event_proposal_ids, status: 'draft'
    end

    return unless has_scope?(:read_signups)
    can :read, Signup, user_con_profile: { user_id: user.id }
  end

  def add_con_staff_abilities
    return unless has_scope?(:read_conventions)

    can :view_reports, Convention, id: con_ids_with_privilege(:con_com)
    can [:schedule, :schedule_with_counts], Convention,
      id: con_ids_with_privilege(:scheduling, :gm_liaison),
      show_schedule: %w[priv gms yes]
    can :read, Run, event: {
      status: 'active',
      convention: {
        id: con_ids_with_privilege(:scheduling, :gm_liaison),
        show_schedule: %w[priv gms yes]
      }
    }
    can [:schedule, :schedule_with_counts], Convention,
      id: con_ids_with_privilege(:con_com),
      show_schedule: %w[gms yes]
    can :read, Run, event: {
      status: 'active',
      convention: {
        id: con_ids_with_privilege(:con_com),
        show_schedule: %w[gms yes]
      }
    }
    can :read, TeamMember, event: { convention_id: con_ids_with_privilege(:gm_liaison) }
    can :read, User if staff_con_ids.any?

    can :read_admin_notes, Event,
      convention_id: con_ids_with_privilege(:proposal_chair, :gm_liaison, :scheduling)
    can [:read, :read_personal_info], UserConProfile, convention_id: con_ids_with_privilege(:con_com)
    can :view_attendees, Convention, id: con_ids_with_privilege(:con_com)
    can :read, Order, user_con_profile: { convention_id: staff_con_ids }
    can :read, Ticket, user_con_profile: { convention_id: con_ids_with_privilege(:con_com) }
    can :read, Signup, run: { event: { convention_id: con_ids_with_privilege(:outreach) } }
    can :read, MaximumEventProvidedTicketsOverride,
      event: {
        convention_id: con_ids_with_privilege(:proposal_chair, :gm_liaison, :scheduling)
      }
    can :read, UserActivityAlert, convention_id: staff_con_ids

    # Mail privileges (smash the patriarchy)
    can :mail_to_any, Convention, id: con_ids_with_privilege(*UserConProfile::MAIL_PRIV_NAMES)
    UserConProfile::MAIL_PRIV_NAMES.each do |mail_priv_name|
      can mail_priv_name.to_sym, Convention, id: con_ids_with_privilege(mail_priv_name)
    end

    return unless has_scope?(:manage_conventions)

    can :manage, [Page, CmsPartial, CmsFile, CmsNavigationItem, CmsLayout, CmsVariable],
      parent_type: 'Convention', parent_id: staff_con_ids

    can :update, Convention, id: staff_con_ids

    can :manage, UserConProfile, convention_id: staff_con_ids
    can :manage, Ticket, user_con_profile: { convention_id: staff_con_ids }
    can :manage, TicketType, convention_id: staff_con_ids
    can :manage, Event,
      convention_id: con_ids_with_privilege(:proposal_chair, :gm_liaison, :scheduling)
    can :manage, MaximumEventProvidedTicketsOverride,
      event: {
        convention_id: con_ids_with_privilege(:proposal_chair, :gm_liaison, :scheduling)
      }
    can :manage, Product, convention_id: staff_con_ids
    can :manage, Run, event: { convention_id: con_ids_with_privilege(:gm_liaison, :scheduling) }
    can :manage, Signup, run: { event: { convention_id: staff_con_ids } }
    can :manage, StaffPosition, convention_id: staff_con_ids
    can :manage, TeamMember do |team_member|
      con_ids_with_privilege(:gm_liaison).include?(team_member.event.convention_id)
    end
    can :manage, Form do |form|
      staff_con_ids.include?(form.convention_id)
    end
    can :manage, Room do |room|
      con_ids_with_privilege(:gm_liaison, :scheduling).include?(room.convention_id)
    end
    can :manage, Order do |order|
      staff_con_ids.include?(order.user_con_profile.convention_id)
    end
    can :manage, UserActivityAlert do |user_activity_alert|
      staff_con_ids.include?(user_activity_alert.convention_id)
    end
  end

  def add_event_proposal_abilities
    return unless has_scope?(:read_events)

    can :read, EventProposal do |event_proposal|
      user_can_view_event_proposal?(event_proposal)
    end
    can :read_admin_notes, EventProposal do |event_proposal|
      con_ids_with_privilege(:proposal_chair, :gm_liaison, :scheduling)
        .include?(event_proposal.convention_id)
    end

    return unless has_scope?(:manage_events)

    can :update, EventProposal do |event_proposal|
      user_can_update_event_proposal?(event_proposal)
    end
    can :update_admin_notes, EventProposal do |event_proposal|
      con_ids_with_privilege(:scheduling).include?(event_proposal.convention_id)
    end
  end

  def add_team_member_abilities
    if has_scope?(:read_events)
      can :read, Run do |run|
        run.event.status == 'active' && user_can_view_convention_schedule?(run.event.convention)
      end
      can :read, MaximumEventProvidedTicketsOverride do |maximum_event_provided_tickets_override|
        team_member_event_ids.include?(maximum_event_provided_tickets_override.event_id)
      end
      can :read, Signup do |signup|
        team_member_event_ids.include?(signup.event_id)
      end
      can :read, Ticket do |ticket|
        team_member_convention_ids.include?(ticket.convention_id)
      end
      can :read, TeamMember do |team_member|
        team_member_event_ids.include?(team_member.event_id)
      end
    end

    if has_scope?(:manage_events)
      can :update, Event do |event|
        team_member_event_ids.include?(event.id)
      end
      can :update, EventProposal do |event_proposal|
        team_member_event_ids.include?(event_proposal.event_id)
      end
      can :update_bucket, Signup do |signup|
        team_member_event_ids.include?(signup.event_id)
      end
      can :manage, TeamMember do |team_member|
        team_member_event_ids.include?(team_member.event_id)
      end
    end

    return unless has_scope?(:read_conventions)
    can(:schedule, Convention) { |convention| user_can_view_convention_schedule?(convention) }
    can :read, UserConProfile do |user_con_profile|
      team_member_convention_ids.include?(user_con_profile.convention_id)
    end
    can :read_personal_info, UserConProfile do |user_con_profile|
      team_member_signed_up_user_con_profile_ids.include?(user_con_profile.id)
    end
  end

  def user_can_view_convention_schedule?(convention)
    case convention.show_schedule
    when 'yes' then true
    when 'gms'
      (team_member_convention_ids + con_ids_with_privilege(:scheduling, :gm_liaison))
        .include?(convention.id)
    when 'priv' then con_ids_with_privilege(:scheduling, :gm_liaison)
    else
      false
    end
  end

  def user_can_view_event_proposal?(event_proposal)
    return true if user.id == event_proposal.owner.user_id

    case event_proposal.status
    when 'proposed'
      con_ids_with_privilege(:proposal_chair).include?(event_proposal.convention_id)
    when EVENT_PROPOSAL_NON_DRAFT_STATUSES
      con_ids_with_privilege(:proposal_chair, :proposal_committee, :gm_liaison).include?(event_proposal.convention_id)
    else
      false
    end
  end

  def user_can_update_event_proposal?(event_proposal)
    case event_proposal.status
    when 'draft'
      user.id == event_proposal.owner.user_id
    when 'proposed', 'reviewing'
      (
        user.id == event_proposal.owner.user_id ||
        con_ids_with_privilege(:proposal_chair)
      )
    when 'accepted', 'withdrawn'
      con_ids_with_privilege(:gm_liaison)
    end
  end
end
