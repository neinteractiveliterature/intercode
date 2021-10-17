# frozen_string_literal: true
class Mutations::RenameCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :filename, String, required: true

  load_and_authorize_cms_model :cms_files, :id, :update

  def resolve(**args)
    cms_file.rename_file(args[:filename])

    { cms_file: cms_file }
  end
end
