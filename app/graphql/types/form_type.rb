class Types::FormType < Types::BaseObject
  field :id, Int, null: false
  field :title, String, null: false
  field :form_api_json, Types::Json, null: false, camelize: false
  field :export_json, Types::Json, null: false, camelize: false
  field :event_categories, [Types::EventCategoryType], null: false, camelize: false
  field :proposal_event_categories, [Types::EventCategoryType], null: false, camelize: false
  field :user_con_profile_conventions, [Types::ConventionType], null: false, camelize: false

  association_loaders Form, :event_categories, :proposal_event_categories, :user_con_profile_conventions

  def form_api_json
    FormApiJsonLoader.for(cadmus_renderer).load(object)
  end

  def export_json
    FormExportPresenter.new(object).as_json
  end
end
