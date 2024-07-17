# frozen_string_literal: true
class Mutations::UpdateFormWithJSON < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :form_json, String, required: true, camelize: false
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :forms, :id, :update

  def resolve(**args)
    ImportFormContentService.new(form:, content: JSON.parse(args[:form_json])).call!

    { form: }
  end
end
