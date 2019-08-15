class ConventionPolicy < ApplicationPolicy
  include Concerns::ScheduleRelease

  def read?
    true
  end

  def schedule?
    return true if oauth_scoped_disjunction do |d|
      d.add_clause { record.show_schedule == 'yes' }
      d.add(:read_conventions) do
        has_schedule_release_permissions?(record, record.show_schedule)
      end
    end

    site_admin_read?
  end

  def list_events?
    return true if oauth_scoped_disjunction do |d|
      d.add_clause { record.show_event_list == 'yes' }
      d.add(:read_conventions) do
        has_schedule_release_permissions?(record, record.show_event_list)
      end
    end

    site_admin_read?
  end

  def schedule_with_counts?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        schedule? && (
          has_privilege_in_convention?(record, :scheduling, :gm_liaison) ||
            has_convention_permission?(record, 'read_schedule_with_counts')
        )
      end
    end

    site_admin_read?
  end

  def view_reports?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        staff_in_convention?(record) ||
          has_convention_permission?(record, 'read_reports')
      end
    end

    site_admin_read?
  end

  def view_attendees?
    UserConProfilePolicy.new(user, UserConProfile.new(convention: record)).read?
  end

  def view_event_proposals?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) do
        has_privilege_in_convention?(record, :gm_liaison) ||
        # this is a weird one: does the user have _any_ permission called read_event_proposal
        # in this convention?
        record.staff_positions.where(
          id: user_permission_scope.where(permission: 'read_event_proposals').select(:staff_position_id)
        ).any?
      end
    end

    site_admin_read?
  end

  def update?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { staff_in_convention?(record) }
    end

    site_admin_manage?
  end

  private

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
