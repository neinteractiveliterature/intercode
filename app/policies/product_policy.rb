# frozen_string_literal: true
class ProductPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    true
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_products') }
         d.add(:manage_events) do
           record.provides_ticket_type&.event && team_member_for_event?(record.provides_ticket_type&.event)
         end
       end
      return true
    end

    super
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
