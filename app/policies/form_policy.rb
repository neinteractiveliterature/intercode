class FormPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    true
  end

  def manage?
    return true if oauth_scope?(:manage_conventions) && staff_in_convention?(convention)

    super
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
