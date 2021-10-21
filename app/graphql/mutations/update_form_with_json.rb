# frozen_string_literal: true
class Mutations::UpdateFormWithJSON < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :form_json, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :forms, :id, :update

  def resolve(**args)
    ImportFormContentService.new(form: form, content: JSON.parse(args[:form_json])).call!

    { form: form }
  end
end
