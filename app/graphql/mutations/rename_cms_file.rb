# frozen_string_literal: true
class Mutations::RenameCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :id, ID, required: false
  argument :filename, String, required: true

  load_and_authorize_cms_model :cms_files, :id, :update

  def resolve(**args)
    cms_file.rename_file(args[:filename])

    { cms_file: cms_file }
  end
end
