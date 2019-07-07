class UserConProfilePolicy < ApplicationPolicy
  delegate :convention, to: :record

  def withdraw_all_signups?
    oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { staff_in_convention?(convention) }
    end

    manage?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
