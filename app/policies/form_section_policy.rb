class FormSectionPolicy < ApplicationPolicy
  delegate :form, to: :record

  def read?
    FormPolicy.new(authorization_info, form).read?
  end

  def manage?
    FormPolicy.new(authorization_info, form).manage?
  end

  class Scope < Scope
    def resolve
      scope.where(form_id: FormPolicy::Scope.new(authorization_info, Form.all).select(:id))
    end
  end
end
