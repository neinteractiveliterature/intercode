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

  attr_reader :user, :associated_records_loader

  # This class defines access controls.
  # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  def initialize(user, associated_records_loader: nil)
    @user = user
    @associated_records_loader = associated_records_loader
    @associated_records_loader ||= AssociatedRecordsLoader.new([user&.id].compact)

    # Here's what the general public can do...
    can :read, Convention
    can :schedule, Convention, show_schedule: 'yes'
    can :read, Event, status: 'active'
    can :read, Form
    can [:read, :root], Page
    can :read, Room
    can :read, Run, event: { status: 'active', convention: { show_schedule: 'yes' } }
    can :read, StaffPosition
    can :read, TicketType

    # Anonymous user permissions end here.
    return unless user

    if user.site_admin?
      # Site admins can do any action whatsoever.
      can :manage, :all
    else
      can [:read, :create, :update], UserConProfile, user_id: user.id
      can [:create, :submit], EventProposal
      can [:read, :update], EventProposal,
        id: own_event_proposal_ids,
        status: %w[draft proposed reviewing]
      can :destroy, EventProposal, id: own_event_proposal_ids, status: 'draft'
      can :signup_summary, Run, id: signed_up_run_ids
      can :read, Ticket, user_con_profile: { user_id: user.id }

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
    can :manage, UserConProfile, convention_id: staff_con_ids
    can :read, UserConProfile, convention_id: con_ids_with_privilege(:con_com)
    can :view_attendees, Convention, id: con_ids_with_privilege(:con_com)
    can :read, Ticket, user_con_profile: { convention_id: con_ids_with_privilege(:con_com) }
    can :manage, Ticket, user_con_profile: { convention_id: staff_con_ids }
    can :manage, TicketType, convention_id: staff_con_ids
    can :manage, Event,
      convention_id: con_ids_with_privilege(:proposal_chair, :gm_liaison, :scheduling)
    can :manage, Run, event: { convention_id: con_ids_with_privilege(:gm_liaison, :scheduling) }
    can :read, Signup, run: { event: { convention_id: con_ids_with_privilege(:outreach) } }
    can :manage, Signup, run: { event: { convention_id: staff_con_ids } }
    can :manage, StaffPosition, convention_id: staff_con_ids
    can :manage, TeamMember, event: { convention_id: con_ids_with_privilege(:gm_liaison) }
    can :manage, Form, convention_id: staff_con_ids
    can :manage, Room, convention_id: con_ids_with_privilege(:gm_liaison, :scheduling)
  end

  def add_event_proposal_abilities
    can :read, EventProposal,
      convention_id: con_ids_with_privilege(:proposal_committee, :gm_liaison),
      status: EVENT_PROPOSAL_NON_DRAFT_STATUSES - ['proposed']
    can [:read, :update], EventProposal,
      convention_id: con_ids_with_privilege(:proposal_chair),
      status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
    can :update, EventProposal,
      convention_id: con_ids_with_privilege(:gm_liaison),
      status: %w[accepted withdrawn]
  end

  def add_team_member_abilities
    can :update, Event, id: team_member_event_ids
    can :schedule, Convention, id: team_member_convention_ids, show_schedule: %w[gms yes]
    can :read, Run, event: {
      status: 'active',
      convention: {
        id: team_member_convention_ids,
        show_schedule: %w[gms yes]
      }
    }
    can :read, UserConProfile, convention_id: team_member_convention_ids
    can :update, EventProposal, event_id: team_member_event_ids
    can :read, Signup, run: { event_id: team_member_event_ids }
    can :read, Ticket, user_con_profile: { convention_id: team_member_convention_ids }
    can :manage, TeamMember, event_id: team_member_event_ids
  end
end
