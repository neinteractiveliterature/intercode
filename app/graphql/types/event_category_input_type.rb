# frozen_string_literal: true
class Types::EventCategoryInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :proposal_description, String, required: false, camelize: false
  argument :transitional_department_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the departmentId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :department_id, ID, required: false, camelize: true
  argument :team_member_name, String, required: false, camelize: false
  argument :scheduling_ui, Types::SchedulingUiType, required: false, camelize: false
  argument :transitional_event_form_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the eventFormId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :event_form_id, ID, required: false, camelize: true
  argument :transitional_event_proposal_form_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the eventProposalFormId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :event_proposal_form_id, ID, required: false, camelize: true
  argument :default_color, String, required: false, camelize: false
  argument :full_color, String, required: false, camelize: false
  argument :signed_up_color, String, required: false, camelize: false
  argument :can_provide_tickets, Boolean, required: false, camelize: false
end
