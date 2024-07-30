# frozen_string_literal: true
class SignupRoundPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    true
  end

  def manage?
    if oauth_scoped_disjunction { |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, "update_convention") }
       }
      return true
    end

    super
  end

  def rerun?
    return false unless convention.signup_mode == "moderated"

    if oauth_scoped_disjunction { |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, "update_signups") }
       }
      return true
    end

    site_admin_manage?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
