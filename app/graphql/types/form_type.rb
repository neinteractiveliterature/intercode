# frozen_string_literal: true
class Types::FormType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :title, String, null: false
  field :form_section, Types::FormSectionType, null: false, camelize: false do
    argument :id,
             Int,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the form section to find.'
    argument :transitional_id, ID, required: false, description: 'The ID of the form section to find.', camelize: true
  end
  field :form_sections, [Types::FormSectionType], null: false, camelize: false
  field :form_api_json,
        Types::JSON,
        null: false,
        camelize: false,
        deprecation_reason:
          "The old form API export is deprecated; please use the \"form\" field \
and its subfields instead"
  field :form_type, Types::FormTypeType, null: false, camelize: false
  field :export_json, Types::JSON, null: false, camelize: false
  field :event_categories, [Types::EventCategoryType], null: false, camelize: false
  field :proposal_event_categories, [Types::EventCategoryType], null: false, camelize: false
  field :user_con_profile_conventions, [Types::ConventionType], null: false, camelize: false

  association_loaders Form, :form_sections, :event_categories, :proposal_event_categories, :user_con_profile_conventions

  authorize_record

  def form_section(id: nil, transitional_id: nil)
    object.form_sections.find(transitional_id || id)
  end

  def form_api_json
    FormApiJSONLoader.for(cadmus_renderer).load(object)
  end

  def export_json
    FormExportPresenter.new(object).as_json
  end
end
