# frozen_string_literal: true
class RunPolicy < ApplicationPolicy
  delegate :event, to: :record
  delegate :convention, to: :event

  def read?
    if oauth_scoped_disjunction do |d|
         d.add(:read_events) do
           convention.site_mode == 'single_event' ||
             has_schedule_release_permissions?(convention, convention.show_schedule)
         end
       end
      return true
    end

    super
  end

  def signup_summary?
    return false if event.private_signup_list?
    SignupPolicy.new(authorization_info, Signup.new(run: record)).read?
  end

  def manage?
    if oauth_scoped_disjunction { |d| d.add(:manage_events) { has_convention_permission?(convention, 'update_runs') } }
      return true
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.none unless oauth_scope?(:read_events)
      return scope.all if site_admin?

      disjunctive_where do |dw|
        dw.add(event: Event.where(convention: conventions_with_schedule_release_permissions(:show_schedule)))

        dw.add(event: Event.where(convention: Convention.where(site_mode: 'single_event')))
      end
    end
  end
end
