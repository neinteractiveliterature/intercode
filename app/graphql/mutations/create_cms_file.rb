# frozen_string_literal: true
class Mutations::CreateCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false
  argument :signed_blob_id, ID, required: false
  argument :file,
           ApolloUploadServer::Upload,
           required: false,
           prepare: ->(upload, _) {
             upload&.__getobj__ # Unwrap value for ActiveStorage
           },
           deprecation_reason: 'Migrating to ActiveStorage direct uploads; please use signed_blob_id instead'

  authorize_create_cms_model :cms_files

  def resolve(file: nil, signed_blob_id: nil)
    attachable = signed_blob_id ? ActiveStorage::Blob.find_signed!(signed_blob_id) : file
    cms_file = cms_parent.cms_files.create!(file: attachable)
    { cms_file: cms_file }
  end
end
