# frozen_string_literal: true
class Mutations::UpdateFormWithJSON < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :form_json, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :forms, :id, :update

  def resolve(**args)
    ImportFormContentService.new(form: form, content: JSON.parse(args[:form_json])).call!

    { form: form }
  end
end
