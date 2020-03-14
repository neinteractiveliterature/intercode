class EmailRoutePolicy < ApplicationPolicy
  def read?
    oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        site_admin?
      end
    end
  end

  def manage?
    oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) do
        site_admin?
      end
    end
  end

  class Scope < Scope
    def resolve
      return scope.none unless oauth_scope?(:read_conventions)

      if site_admin?
        scope.all
      else
        scope.none
      end
    end
  end
end
