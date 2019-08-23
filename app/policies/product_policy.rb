class ProductPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    true
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { has_convention_permission?(convention, 'update_products') }
    end

    super
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
