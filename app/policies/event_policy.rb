class EventPolicy < ApplicationPolicy
  include Concerns::ScheduleRelease

  delegate :convention, to: :record

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) do
        convention.site_mode == 'single_event' ||
        (
          record.status == 'active' &&
          has_schedule_release_permissions?(convention, convention.show_event_list)
        ) ||
        has_event_category_permission?(record.event_category_id, 'update_events') ||
        has_privilege_in_convention?(convention, :gm_liaison, :scheduling)
      end
    end

    super
  end

  def manage?
    false # not even site admins - destroy is disallowed across the board
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

  def update_admin_notes?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_events) do
        has_event_category_permission?(record.event_category_id, :access_admin_notes) ||
        has_privilege_in_convention?(convention, :gm_liaison, :scheduling)
      end
    end

    site_admin_manage?
  end

  def drop?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_events) do
        has_event_category_permission?(record.event_category_id, :update_events) ||
        has_privilege_in_convention?(convention, :gm_liaison, :scheduling)
      end
    end

    site_admin_manage?
  end

  def update?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_events) do
        team_member_for_event?(record) ||
        has_event_category_permission?(record.event_category_id, :update_events) ||
        has_privilege_in_convention?(convention, :gm_liaison, :scheduling)
      end
    end

    super
  end

  class Scope < Scope
    include Concerns::ScheduleRelease

    def resolve
      return scope.all if oauth_scope?(:read_events) && site_admin?

      disjunctive_where do |dw|
        if user
          dw.add(
            id: TeamMember.where(user_con_profile: UserConProfile.where(user_id: user.id))
              .select(:event_id),
            status: 'active'
          )
        end

        dw.add(convention: Convention.where(site_mode: 'single_event'))

        dw.add(
          convention: conventions_with_schedule_release_permissions(:show_event_list),
          status: 'active'
        )

        # gm_liaison and scheduling can see events regardless of status
        dw.add(convention: conventions_with_privilege(:gm_liaison, :scheduling))

        # event updaters can see dropped events in their categories
        dw.add(event_category: event_categories_with_permission('update_events'))
      end
    end
  end
end
