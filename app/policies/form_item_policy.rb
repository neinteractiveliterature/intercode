class FormItemPolicy < ApplicationPolicy
  delegate :form_section, to: :record

  def read?
    FormSectionPolicy.new(authorization_info, form_section).read?
  end

  def manage?
    FormSectionPolicy.new(authorization_info, form_section).manage?
  end

  class Scope < Scope
    def resolve
      scope.where(
        form_section_id: FormSectionPolicy::Scope.new(authorization_info, FormSection.all)
          .select(:id)
      )
    end
  end
end
