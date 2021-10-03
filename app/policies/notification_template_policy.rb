# frozen_string_literal: true
class NotificationTemplatePolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    if oauth_scoped_disjunction do |d|
         d.add(:read_conventions) { has_convention_permission?(convention, 'read_notification_templates') }
       end
      return true
    end

    super
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_notification_templates') }
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
          dw.add(convention_id: conventions_with_permission('read_notification_templates').select(:id))
        end
      end
    end
  end
end
