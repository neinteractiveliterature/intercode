class Mutations::CreateCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false
  argument :file, ApolloUploadServer::Upload, required: true

  authorize_create_cms_model :cms_files

  def resolve(file:)
    cms_file = cms_parent.cms_files.create!(file: file)
    cms_file.file.store! # force store early so we can get the URL
    { cms_file: cms_file }
  end
end
