class Types::FormType < Types::BaseObject
  field :id, Int, null: false
  field :title, String, null: false
  field :form_sections, [Types::FormSectionType], null: false, camelize: false
  field :form_api_json, Types::JSON, null: false, camelize: false
  field :form_type, Types::FormTypeType, null: false, camelize: false
  field :export_json, Types::JSON, null: false, camelize: false
  field :event_categories, [Types::EventCategoryType], null: false, camelize: false
  field :proposal_event_categories, [Types::EventCategoryType], null: false, camelize: false
  field :user_con_profile_conventions, [Types::ConventionType], null: false, camelize: false

  association_loaders Form, :form_sections, :event_categories, :proposal_event_categories,
    :user_con_profile_conventions

  authorize_record

  def form_api_json
    FormApiJSONLoader.for(cadmus_renderer).load(object)
  end

  def export_json
    FormExportPresenter.new(object).as_json
  end
end
