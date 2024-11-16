# frozen_string_literal: true
class EventPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    if oauth_scoped_disjunction { |d|
         d.add(:read_events) do
           convention.site_mode == "single_event" || team_member_for_event?(record) ||
             (record.status == "active" && has_schedule_release_permissions?(convention, convention.show_event_list)) ||
             has_applicable_permission?("read_inactive_events", "update_events") ||
             (team_member_in_convention?(convention) && record.provided_tickets.any?)
         end
       }
      return true
    end

    super
  end

  def manage?
    false # not even site admins - destroy is disallowed across the board
  end

  def read_admin_notes?
    if oauth_scoped_disjunction { |d| d.add(:read_events) { has_applicable_permission?("access_admin_notes") } }
      return true
    end

    site_admin_read?
  end

  def update_admin_notes?
    if oauth_scoped_disjunction { |d| d.add(:manage_events) { has_applicable_permission?("access_admin_notes") } }
      return true
    end

    site_admin_manage?
  end

  def drop?
    if oauth_scoped_disjunction { |d| d.add(:manage_events) { has_applicable_permission?("update_events") } }
      return true
    end

    site_admin_manage?
  end

  def create?
    drop?
  end

  def restore?
    drop?
  end

  def update?
    if oauth_scoped_disjunction { |d|
         d.add(:manage_events) { team_member_for_event?(record) || has_applicable_permission?("update_events") }
       }
      return true
    end

    site_admin_manage?
  end

  def form_item_viewer_role
    FormItem.highest_level_role(
      confirmed_attendee: confirmed_for_event?(record),
      team_member: team_member_for_event?(record),
      admin: has_applicable_permission?("update_events") || site_admin_manage?
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

  class Scope < Scope
    def resolve
      return scope.all if oauth_scope?(:read_events) && site_admin?

      convention_id = scope.where_values_hash.stringify_keys["convention_id"]
      if convention_id.is_a?(Integer)
        convention = Convention.find(convention_id)
        resolve_for_single_convention(convention)
      else
        resolve_global
      end
    end

    # The slow-but-painfully-correct path
    def resolve_global
      disjunctive_where do |dw|
        dw.add(team_member_event_conditions) if user

        dw.add(convention: Convention.where(site_mode: "single_event"))

        dw.add(convention: conventions_with_schedule_release_permissions(:show_event_list), status: "active")
        dw.add(convention: conventions_with_permission("read_inactive_events"))

        # event updaters can see dropped events in their categories
        dw.add(event_category: event_categories_with_permission("update_events"))

        # update_events users can see dropped events in the convention as a whole
        dw.add(convention: conventions_with_permission("update_events"))
      end
    end

    # The fast path where we can do simpler checks inside a single convention
    def resolve_for_single_convention(convention)
      return scope.all if convention.site_mode == "single_event"
      return scope.all if has_convention_permission?(convention, "read_inactive_events", "update_events")
      return scope.where(status: "active") if has_schedule_release_permissions?(convention, convention.show_event_list)

      disjunctive_where do |dw|
        dw.add(team_member_event_conditions) if user

        dw.add(event_category_id: event_category_ids_with_permission_in_convention(convention, "update_events"))
      end
    end

    def team_member_event_conditions
      team_member_event_conditions = {
        id: TeamMember.where(user_con_profile: UserConProfile.where(user_id: user.id)).select(:event_id),
        status: "active"
      }

      if assumed_identity_from_profile
        team_member_event_conditions[:id] = team_member_event_conditions[:id].joins(:event).where(
          events: {
            convention_id: assumed_identity_from_profile.convention_id
          }
        )
      end

      team_member_event_conditions
    end
  end
end
