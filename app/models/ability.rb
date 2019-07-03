class Ability
  class AssociatedRecordsLoader
    attr_reader :user_ids

    def initialize(user_ids)
      @user_ids = user_ids
    end

    def team_member_event_ids(user_id)
      (team_member_event_ids_and_convention_ids[user_id] || []).map(&:first)
    end

    def team_member_convention_ids(user_id)
      (team_member_event_ids_and_convention_ids[user_id] || []).map(&:second)
    end

    def team_member_signed_up_user_con_profile_ids(user_id)
      team_member_signed_up_user_con_profile_ids_by_user_id[user_id] || []
    end

    def con_ids_with_privilege(user_id, *privileges)
      (privileges + ['staff']).uniq.flat_map do |privilege|
        user_con_ids_by_privilege = con_ids_by_user_id_and_privilege[user_id] || {}
        user_con_ids_by_privilege[privilege.to_s] || []
      end.uniq
    end

    def staff_con_ids(user_id)
      con_ids_with_privilege(user_id, :staff)
    end

    def signed_up_run_ids(user_id)
      signed_up_run_ids_by_user_id[user_id] || []
    end

    def own_event_proposal_ids(user_id)
      own_event_proposal_ids_by_user_id[user_id] || []
    end

    private

    def con_ids_by_user_id_and_privilege
      @con_ids_by_user_id_and_privilege ||= begin
        user_con_profiles = UserConProfile.where(user_id: user_ids).includes(:user)
        con_ids_with_privileges = user_con_profiles.flat_map do |user_con_profile|
          user_con_profile.privileges.map do |privilege|
            [user_con_profile.user_id, user_con_profile.convention_id, privilege]
          end
        end

        privilege_tuples_by_user_id = con_ids_with_privileges.group_by { |(user_id, _, _)| user_id }
        privilege_tuples_by_user_id.transform_values do |privilege_tuples|
          privilege_tuples
            .group_by { |(_, _, privilege)| privilege }
            .transform_values { |rows| rows.map { |(_, convention_id, _)| convention_id } }
        end
      end
    end

    def team_member_event_ids_and_convention_ids
      @team_member_event_ids_and_convention_ids ||= begin
        team_member_events = Event.joins(team_members: :user_con_profile)
          .where(user_con_profiles: { user_id: user_ids })
        team_member_event_data = team_member_events.pluck(:user_id, :id, :convention_id)
        team_member_event_data.group_by(&:first).transform_values do |rows|
          rows.map do |(_, id, convention_id)|
            [id, convention_id]
          end
        end
      end
    end

    def team_member_signed_up_user_con_profile_ids_by_user_id
      @team_member_signed_up_user_con_profile_ids ||= begin
        team_member_run_ids_by_event_id = Run
          .where(event_id: team_member_event_ids_and_convention_ids.values.flat_map { |pairs| pairs.map(&:first) })
          .pluck(:event_id, :id)
          .group_by(&:first)
          .transform_values { |pairs| pairs.map(&:second) }
        team_member_event_ids_by_run_id = team_member_run_ids_by_event_id.each_with_object({}) do |(event_id, run_ids), hash|
          run_ids.each do |run_id|
            hash[run_id] = event_id
          end
        end

        team_member_run_ids_by_user_id = team_member_event_ids_and_convention_ids.each_with_object({}) do |(user_id, pairs), hash|
          event_ids = pairs.map(&:first)
          run_ids = event_ids.flat_map { |event_id| team_member_run_ids_by_event_id[event_id] }
          hash[user_id] = run_ids
        end

        signed_up_user_con_profile_ids_by_run_id = Signup.where(run_id: team_member_run_ids_by_user_id.values.flatten)
          .pluck(:run_id, :user_con_profile_id)
          .group_by(&:first)
          .transform_values { |pairs| pairs.map(&:second) }

        team_member_user_con_profile_ids_by_event_id = TeamMember.where(event_id: team_member_event_ids_by_run_id.values.flatten)
          .pluck(:event_id, :user_con_profile_id)
          .group_by(&:first)
          .transform_values { |pairs| pairs.map(&:second) }

        team_member_run_ids_by_user_id.transform_values do |run_ids|
          run_ids.flat_map do |run_id|
            ((signed_up_user_con_profile_ids_by_run_id[run_id] || []) +
              (team_member_user_con_profile_ids_by_event_id[team_member_event_ids_by_run_id[run_id]] || [])).uniq
          end
        end
      end
    end

    def signed_up_run_ids_by_user_id
      @signed_up_run_ids_by_user_id ||= Signup.joins(:user_con_profile)
        .where(user_con_profiles: { user_id: user_ids }, state: %w[confirmed waitlisted])
        .pluck(:run_id, :user_id)
        .group_by { |(_, user_id)| user_id }
        .transform_values do |rows|
          rows.map { |(run_id, _)| run_id }
        end
    end

    def own_event_proposal_ids_by_user_id
      @own_event_proposal_ids_by_user_id ||= begin
        own_event_proposals = EventProposal.joins(:owner)
          .where(user_con_profiles: { user_id: user_ids })
        own_event_proposals.pluck(:id, :user_id)
          .group_by { |(_, user_id)| user_id }
          .transform_values do |rows|
            rows.map { |(event_proposal_id, _)| event_proposal_id }
          end
      end
    end
  end

  EVENT_PROPOSAL_NON_DRAFT_STATUSES = EventProposal::STATUSES.to_a - ['draft']

  include CanCan::Ability
  include Ability::EventCategoryPermissions
  include Ability::OrganizationPermissions

  attr_reader :user, :doorkeeper_token, :associated_records_loader

  # This class defines access controls.
  # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  def initialize(user, doorkeeper_token, associated_records_loader: nil)
    alias_action :export, to: :read

    @user = user
    @doorkeeper_token = doorkeeper_token
    @associated_records_loader = associated_records_loader
    @associated_records_loader ||= AssociatedRecordsLoader.new([user&.id].compact)

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
      add_event_category_permission_abilities
      add_organization_permission_abilities
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
    can :list_events, Convention, show_event_list: 'yes'
    can :read, Event, status: 'active'
    can :read, EventCategory
    can [:read, :root], Page
    can :read, Room
    can :read, Run, event: { status: 'active', convention: { site_mode: 'single_event' } }
    can :read, Run, event: { status: 'active', convention: { show_schedule: 'yes' } }
  end

  def add_site_admin_abilities
    # only allow managing OAuth apps via actual cookie session
    can :manage, Doorkeeper::Application unless doorkeeper_token

    can :read, [Event, Run, Signup] if has_scope?(:read_signups)
    can :signup_summary, Run, event: { private_signup_list: false }

    if has_scope?(:read_events)
      can :read, [
        Event,
        EventCategory,
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
        :list_events,
        :view_reports,
        :view_attendees
      ], Convention
      can :read, [Permission, UserConProfile, User, UserActivityAlert]
      can [:read_email, :read_personal_info], UserConProfile
    end

    can :read, Organization if has_scope?(:read_organizations)

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

    if has_scope?(:manage_organizations)
      can :manage, Organization
      can :manage, OrganizationRole
    end

    return unless has_scope?(:manage_conventions)
    can :manage, [
      CmsFile,
      CmsGraphqlQuery,
      CmsLayout,
      CmsNavigationItem,
      CmsPartial,
      CmsVariable,
      Convention,
      EventCategory,
      Page,
      Permission,
      Room,
      RootSite,
      SignupRequest,
      User,
      UserActivityAlert,
      UserConProfile
    ]
  end

  def add_authenticated_user_abilities
    can :read, UserConProfile, user_id: user.id
    can :revert_become, UserConProfile

    if has_scope?(:read_profile)
      can [:read_email, :read_personal_info], UserConProfile, user_id: user.id
    end

    can [:create, :update], UserConProfile, user_id: user.id if has_scope?(:manage_profile)

    if has_scope?(:read_events)
      can :read, EventProposal, id: own_event_proposal_ids
      can :read, EventProposal, owner: { user_id: user.id }
      can :signup_summary, Run, id: signed_up_run_ids, event: { private_signup_list: false }
      can :read, TeamMember, user_con_profile: { user_id: user.id }
    end

    if has_scope?(:manage_events)
      can :create, EventProposal
      can :submit, EventProposal, id: own_event_proposal_ids
      can :update, EventProposal,
        id: own_event_proposal_ids,
        status: %w[draft proposed reviewing]
      can :destroy, EventProposal, id: own_event_proposal_ids, status: 'draft'
    end

    if has_scope?(:manage_signups)
      can :create, SignupRequest
      can :withdraw, SignupRequest, user_con_profile_id: { user_id: user.id }, status: %w[pending]
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
    can :list_events, Convention,
      id: con_ids_with_privilege(:scheduling, :gm_liaison),
      show_event_list: %w[priv gms yes]
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
    can :list_events, Convention,
      id: con_ids_with_privilege(:con_com),
      show_event_list: %w[gms yes]
    can :read, Run, event: {
      status: 'active',
      convention: {
        id: con_ids_with_privilege(:con_com),
        show_schedule: %w[gms yes]
      }
    }
    can token_scope_action(:manage_conventions), TeamMember, event: { convention_id: con_ids_with_privilege(:gm_liaison, :con_com) }

    # TODO: Re-enable this once Organizations exist
    # can :read, User if staff_con_ids.any?

    can :read_admin_notes, Event,
      convention_id: con_ids_with_privilege(:gm_liaison, :scheduling)
    can [:read, :read_email, :read_personal_info], UserConProfile, convention_id: con_ids_with_privilege(:con_com)
    can :view_attendees, Convention, id: con_ids_with_privilege(:con_com)
    can :read, Permission, staff_position: { convention_id: staff_con_ids }
    can :read, Signup, run: { event: { convention_id: con_ids_with_privilege(:outreach, :con_com) } }
    can :read, SignupRequest, target_run: { event: { convention: { id: staff_con_ids, signup_mode: 'moderated' } } }
    can token_scope_action(:manage_conventions), MaximumEventProvidedTicketsOverride,
      event: {
        convention_id: con_ids_with_privilege(:gm_liaison, :scheduling)
      }
    can token_scope_action(:manage_conventions), UserActivityAlert, convention_id: staff_con_ids

    # Mail privileges (smash the patriarchy)
    can :mail_to_any, Convention, id: con_ids_with_privilege(*UserConProfile::MAIL_PRIV_NAMES)
    UserConProfile::MAIL_PRIV_NAMES.each do |mail_priv_name|
      can mail_priv_name.to_sym, Convention, id: con_ids_with_privilege(mail_priv_name)
    end

    return unless has_scope?(:manage_conventions)

    can :manage,
      [Page, CmsPartial, CmsFile, CmsGraphqlQuery, CmsNavigationItem, CmsLayout, CmsVariable],
      parent_type: 'Convention', parent_id: staff_con_ids

    can :update, Convention, id: staff_con_ids

    can :manage, UserConProfile, convention_id: staff_con_ids
    can :manage, Event,
      convention_id: con_ids_with_privilege(:gm_liaison, :scheduling)
    can :manage, EventCategory, convention_id: staff_con_ids
    can :manage, Permission, staff_position: { convention_id: staff_con_ids }
    can :manage, Run, event: { convention_id: con_ids_with_privilege(:gm_liaison, :scheduling) }
    can :manage, Signup, run: { event: { convention_id: staff_con_ids } }
    can :manage, SignupRequest, target_run: { event: { convention: { id: staff_con_ids, signup_mode: 'moderated' } } }
    can :manage, Room, convention_id: con_ids_with_privilege(:gm_liaison, :scheduling)
  end

  def add_event_proposal_abilities
    return unless has_scope?(:read_events)

    can :read, EventProposal,
      convention_id: staff_con_ids,
      status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
    can :read, EventProposal,
      convention_id: con_ids_with_privilege(:gm_liaison),
      status: EVENT_PROPOSAL_NON_DRAFT_STATUSES - ['proposed']
    can :view_event_proposals, Convention, id: con_ids_with_privilege(:gm_liaison)
    can token_scope_action(:manage_events, :read_admin_notes, :update_admin_notes), EventProposal,
      convention_id: con_ids_with_privilege(:gm_liaison, :scheduling)

    return unless has_scope?(:manage_events)

    can :update, EventProposal,
      convention_id: staff_con_ids,
      status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
    can :update, EventProposal,
      convention_id: con_ids_with_privilege(:gm_liaison),
      status: %w[accepted withdrawn]
  end

  def add_team_member_abilities
    if has_scope?(:read_events)
      can :read, Run, event: {
        status: 'active',
        convention: {
          id: team_member_convention_ids,
          show_schedule: %w[gms yes]
        }
      }
      can :read, MaximumEventProvidedTicketsOverride, event_id: team_member_event_ids
      can(
        token_scope_action(
          :manage_events,
          :read,
          [:read, :update_bucket, :force_confirm, :update_counted]
        ),
        Signup,
        run: { event_id: team_member_event_ids }
      )
      can token_scope_action(:manage_events), TeamMember, event_id: team_member_event_ids
    end

    if has_scope?(:manage_events)
      can :update, Event, id: team_member_event_ids
      can :update, EventProposal, event_id: team_member_event_ids
    end

    return unless has_scope?(:read_conventions)
    can :schedule, Convention, id: team_member_convention_ids, show_schedule: %w[gms yes]
    can :list_events, Convention, id: team_member_convention_ids, show_event_list: %w[gms yes]
    can [:read, :read_email], UserConProfile, convention_id: team_member_convention_ids
    can :read_personal_info, UserConProfile, id: team_member_signed_up_user_con_profile_ids
  end

  def token_scope_action(manage_scope, read_action = :read, manage_action = :manage)
    if has_scope?(manage_scope)
      manage_action
    else
      read_action
    end
  end

  def scope_authorization(action, model_class, scope, &allow_model)
    subquery = scope.select(model_class.primary_key).to_sql
    sql = "#{model_class.table_name}.#{model_class.primary_key} IN (#{subquery})"

    can action, model_class, sql, &allow_model
  end

  def user_permission_scope
    @user_permission_scope ||= Permission.for_user(user)
  end
end
