class Mutations::DeleteCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :id, Integer, required: true

  load_and_authorize_cms_model :cms_files, :id, :destroy

  def resolve(**_args)
    cms_file.file.remove!
    cms_file.destroy!
    { cms_file: cms_file }
  end
end
