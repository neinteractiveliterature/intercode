class Mutations::AttachImageToEvent < Mutations::BaseMutation
  field :attachment, Types::ActiveStorageAttachmentType, null: false
  field :event, Types::EventType, null: false

  argument :id, ID, required: false
  argument :signed_blob_id, ID, required: true

  load_and_authorize_convention_associated_model :events, :id, :update

  def resolve(signed_blob_id:, **_args)
    blob = ActiveStorage::Blob.find_signed!(signed_blob_id)
    event.images.attach(blob)
    event.save!
    Rails.cache.delete_multi([[event, 'short_blurb_html'], [event, 'description_html']])

    attachment = event.images.attachments.find { |att| att.blob_id == blob.id }

    { attachment:, event: }
  end
end
