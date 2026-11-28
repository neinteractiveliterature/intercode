# frozen_string_literal: true
class Types::FormType < Types::BaseObject
  description "A configurable form, such as an event or user profile form"
  field :event_categories,
        [Types::EventCategoryType],
        null: false,
        camelize: false,
        description: "The event categories that use this as their event form"
  field :export_json,
        Types::JSON,
        null: false,
        camelize: false,
        description: "The whole form definition as JSON, for exporting"
  field :form_section,
        Types::FormSectionType,
        null: false,
        camelize: false,
        description: "A single section of this form by ID" do
    # rubocop:disable-next GraphQL/UnnecessaryArgumentCamelize
    argument :id, ID, required: true, description: "The ID of the form section to find.", camelize: true
  end
  field :form_sections, [Types::FormSectionType], null: false, camelize: false, description: "The sections of this form"
  # rubocop:disable-next GraphQL/ExtractType
  field :form_type, Types::FormTypeType, null: false, camelize: false, description: "What this form is used for"
  field :id, ID, null: false, description: "The ID of this form"
  field :proposal_event_categories,
        [Types::EventCategoryType],
        null: false,
        camelize: false,
        description: "The event categories that use this as their proposal form"
  field :title, String, null: false, description: "The title of this form"
  field :user_con_profile_conventions,
        [Types::ConventionType],
        null: false,
        camelize: false,
        description: "The conventions that use this as their user profile form"

  association_loaders Form, :form_sections, :event_categories, :proposal_event_categories, :user_con_profile_conventions

  authorize_record

  def form_section(id:)
    object.form_sections.find(id)
  end

  def export_json
    FormExportPresenter.new(object).as_json
  end
end
