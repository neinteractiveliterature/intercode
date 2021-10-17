# frozen_string_literal: true
class EmailRoutePolicy < ApplicationPolicy
  def read?
    oauth_scoped_disjunction { |d| d.add(:read_email_routing) { site_admin? } }
  end

  def manage?
    oauth_scoped_disjunction { |d| d.add(:manage_email_routing) { site_admin? } }
  end

  class Scope < Scope
    def resolve
      return scope.none unless oauth_scope?(:read_email_routing)

      site_admin? ? scope.all : scope.none
    end
  end
end
