# frozen_string_literal: true
class Mutations::RenameCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :filename, String, required: true

  load_and_authorize_cms_model :cms_files, :id, :update

  def resolve(**args)
    cms_file.rename_file(args[:filename])

    { cms_file: cms_file }
  end
end
