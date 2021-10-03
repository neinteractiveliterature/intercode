# frozen_string_literal: true
class DepartmentPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    if oauth_scoped_disjunction do |d|
         d.add(:read_conventions) { has_convention_permission?(convention, 'read_departments') }
       end
      return true
    end

    super
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_departments') }
       end
      return true
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope if site_admin?

      disjunctive_where do |dw|
        if oauth_scope?(:read_conventions)
          dw.add(convention_id: conventions_with_permission('read_departments').select(:id))
        end
      end
    end
  end
end
