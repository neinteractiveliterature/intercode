# frozen_string_literal: true
class Mutations::RenameCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :filename, String, required: true
  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_files, :id, :update

  def resolve(**args)
    cms_file.rename_file(args[:filename])

    { cms_file: }
  end
end
