# frozen_string_literal: true
class Types::EventCategoryInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :proposal_description, String, required: false, camelize: false
  argument :department_id, ID, required: false, camelize: true
  argument :team_member_name, String, required: false, camelize: false
  argument :scheduling_ui, Types::SchedulingUiType, required: false, camelize: false
  argument :event_form_id, ID, required: false, camelize: true
  argument :event_proposal_form_id, ID, required: false, camelize: true
  argument :default_color, String, required: false, camelize: false
  argument :full_color, String, required: false, camelize: false
  argument :signed_up_color, String, required: false, camelize: false
  argument :can_provide_tickets, Boolean, required: false, camelize: false
end
