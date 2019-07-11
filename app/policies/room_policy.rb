class RoomPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    true
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { has_privilege_in_convention?(convention, :gm_liaison, :scheduling) }
    end

    super
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
