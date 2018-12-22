class Types::EventCategoryType < Types::BaseObject
  field :id, Int, null: false
  field :convention, Types::ConventionType, null: false
  field :name, String, null: false
  field :team_member_name, String, null: false, camelize: false
  field :scheduling_ui, Types::SchedulingUiType, null: false, camelize: false
  field :event_form, Types::FormType, null: false, camelize: false
  field :event_proposal_form, Types::FormType, null: true, camelize: false

  association_loaders EventCategory, :convention, :event_form, :event_proposal_form
end
