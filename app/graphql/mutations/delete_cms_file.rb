class Mutations::DeleteCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    cms_file = cms_parent.cms_files.find(args[:id])
    cms_file.file.remove!
    cms_file.destroy!
    { cms_file: cms_file }
  end
end
