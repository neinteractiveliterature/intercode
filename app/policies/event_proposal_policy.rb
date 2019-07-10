class EventProposalPolicy < ApplicationPolicy
  EVENT_PROPOSAL_NON_DRAFT_STATUSES = EventProposal::STATUSES.to_a - ['draft']
  EVENT_PROPOSAL_NON_PENDING_STATUSES = EVENT_PROPOSAL_NON_DRAFT_STATUSES - ['proposed']

  delegate :convention, to: :record

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) do
        (user && record.owner.user_id == user.id) ||
        (
          EVENT_PROPOSAL_NON_DRAFT_STATUSES.include?(record.status) &&
          has_event_category_permission?(record.event_category_id, :read_pending_event_proposals)
        ) ||
        (
          EVENT_PROPOSAL_NON_PENDING_STATUSES.include?(record.status) &&
          has_event_category_permission?(record.event_category_id, :read_event_proposals) ||
          has_privilege_in_convention?(convention, :gm_liaison)
        ) ||
        staff_in_convention?(convention)
      end
    end

    super
  end

  def read_admin_notes?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) do
        has_event_category_permission?(record.event_category_id, :access_admin_notes) ||
        has_privilege_in_convention?(convention, :gm_liaison, :scheduling)
      end
    end

    site_admin_read?
  end

  def create?
    !!user_con_profile_for_convention(convention)
  end

  def update?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_events) do
        (
          %w[draft proposed reviewing].include?(record.status) &&
          user && record.owner.user_id == user.id
        ) ||
        (
          EVENT_PROPOSAL_NON_DRAFT_STATUSES.include?(record.status) && (
            has_event_category_permission?(record.event_category_id, :update_event_proposals) ||
            staff_in_convention?(convention)
          )
        ) ||
        (
          %w[accepted withdrawn].include?(record.status) &&
          has_privilege_in_convention?(convention, :gm_liaison)
        ) ||
        (
          record.event && team_member_for_event?(record.event)
        )
      end
    end

    super
  end

  def destroy?
    oauth_scope?(:manage_events) &&
      record.status == 'draft' &&
      user &&
      record.owner.user_id == user.id
  end

  def submit?
    oauth_scope?(:manage_events) &&
      user &&
      record.owner.user_id == user.id
  end

  def update_admin_notes?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_events) do
        has_event_category_permission?(record.event_category_id, :access_admin_notes) ||
        has_privilege_in_convention?(convention, :gm_liaison, :scheduling)
      end
    end

    site_admin_manage?
  end

  class Scope < Scope
    def resolve
      return scope.all if oauth_scope?(:read_events) && site_admin?

      disjunctive_where do |dw|
        dw.add(owner: UserConProfile.where(user_id: user.id)) if user
        dw.add(
          event_category_id: event_categories_with_permission(:read_pending_event_proposals),
          status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
        )
        dw.add(
          event_category_id: event_categories_with_permission(:read_event_proposals),
          status: EVENT_PROPOSAL_NON_PENDING_STATUSES
        )
        dw.add(
          convention_id: conventions_with_privilege(:gm_liaison),
          status: EVENT_PROPOSAL_NON_PENDING_STATUSES
        )
        dw.add(convention_id: conventions_where_staff)
      end
    end
  end
end
