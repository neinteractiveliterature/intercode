class Types::EventCategoryType < Types::BaseObject
  field :id, Int, null: false
  field :convention, Types::ConventionType, null: false
  field :name, String, null: false
  field :team_member_name, String, null: false, camelize: false
  field :scheduling_ui, Types::SchedulingUiType, null: false, camelize: false
  field :event_form, Types::FormType, null: false, camelize: false
  field :event_proposal_form, Types::FormType, null: true, camelize: false
  field :default_color, String, null: true, camelize: false
  field :full_color, String, null: true, camelize: false
  field :signed_up_color, String, null: true, camelize: false
  field :can_provide_tickets, Boolean, null: false, camelize: false, method: :can_provide_tickets?

  association_loaders EventCategory, :convention, :event_form, :event_proposal_form
end
