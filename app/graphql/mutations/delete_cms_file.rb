# frozen_string_literal: true
class Mutations::DeleteCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_files, :id, :destroy

  def resolve(**_args)
    cms_file.file.purge_later
    cms_file.destroy!
    { cms_file: cms_file }
  end
end
