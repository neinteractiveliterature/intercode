# frozen_string_literal: true
class EventProposalPolicy < ApplicationPolicy
  EVENT_PROPOSAL_NON_DRAFT_STATUSES = EventProposal::STATUSES.to_a - ['draft']
  EVENT_PROPOSAL_NON_PENDING_STATUSES = EVENT_PROPOSAL_NON_DRAFT_STATUSES - ['proposed']

  delegate :convention, to: :record

  def read?
    if oauth_scoped_disjunction do |d|
         d.add(:read_events) do
           user_is_owner? ||
             (
               EVENT_PROPOSAL_NON_DRAFT_STATUSES.include?(record.status) &&
                 has_applicable_permission?(:read_pending_event_proposals)
             ) ||
             (
               EVENT_PROPOSAL_NON_PENDING_STATUSES.include?(record.status) &&
                 has_applicable_permission?(:read_event_proposals)
             )
         end
       end
      return true
    end

    super
  end

  def read_admin_notes?
    if oauth_scoped_disjunction { |d| d.add(:read_events) { has_applicable_permission?(:access_admin_notes) } }
      return true
    end

    site_admin_read?
  end

  def create?
    !!user_con_profile_for_convention(convention)
  end

  def update?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_events) do
           (%w[draft proposed reviewing tentative_accept].include?(record.status) && user_is_owner?) ||
             (
               EVENT_PROPOSAL_NON_DRAFT_STATUSES.include?(record.status) &&
                 has_applicable_permission?(:update_event_proposals)
             ) || team_member_for_accepted_proposal?
         end
       end
      return true
    end

    super
  end

  def destroy?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != record.convention
    oauth_scope?(:manage_events) && record.status == 'draft' && user && record.owner.user_id == user.id
  end

  def submit?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != record.convention
    oauth_scope?(:manage_events) && user && record.owner.user_id == user.id
  end

  def update_admin_notes?
    if oauth_scoped_disjunction { |d| d.add(:manage_events) { has_applicable_permission?(:access_admin_notes) } }
      return true
    end

    site_admin_manage?
  end

  def form_item_viewer_role
    return :normal if assumed_identity_from_profile && assumed_identity_from_profile.convention != record.convention
    FormItem.highest_level_role(
      team_member: user_is_owner?,
      admin:
        (
          EVENT_PROPOSAL_NON_DRAFT_STATUSES.include?(record.status) &&
            has_applicable_permission?(:update_event_proposals)
        )
    )
  end

  def form_item_writer_role
    form_item_viewer_role
  end

  private

  def has_applicable_permission?(*permissions)
    has_event_category_permission?(record.event_category, *permissions) ||
      has_convention_permission?(convention, *permissions)
  end

  def user_is_owner?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != record.convention
    user && record.owner && record.owner.user_id == user.id
  end

  def team_member_for_accepted_proposal?
    record.event && team_member_for_event?(record.event)
  end

  class Scope < Scope
    def scope
      assumed_identity_from_profile ? @scope.where(convention_id: assumed_identity_from_profile.convention.id) : @scope
    end

    def resolve
      return scope.all if oauth_scope?(:read_events) && site_admin?

      disjunctive_where do |dw|
        dw.add(owner: UserConProfile.where(user_id: user.id)) if user
        dw.add(
          event_category_id: event_categories_with_permission(:read_pending_event_proposals),
          status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
        )
        dw.add(
          convention_id: conventions_with_permission(:read_pending_event_proposals),
          status: EVENT_PROPOSAL_NON_DRAFT_STATUSES
        )
        dw.add(
          event_category_id: event_categories_with_permission(:read_event_proposals),
          status: EVENT_PROPOSAL_NON_PENDING_STATUSES
        )
        dw.add(
          convention_id: conventions_with_permission(:read_event_proposals),
          status: EVENT_PROPOSAL_NON_PENDING_STATUSES
        )
      end
    end
  end
end
