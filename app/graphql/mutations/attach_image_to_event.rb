class Mutations::AttachImageToEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false
  field :attachment, Types::ActiveStorageAttachmentType, null: false

  argument :id, ID, required: false
  argument :signed_blob_id, ID, required: true

  load_and_authorize_convention_associated_model :events, :id, :update

  def resolve(signed_blob_id:, **_args)
    blob = ActiveStorage::Blob.find_signed!(signed_blob_id)
    event.images.attach(blob)
    event.save!
    Rails.cache.delete_multi([[event, 'short_blurb_html'], [event, 'description_html']])

    attachment = event.images.attachments.find { |att| att.blob_id == blob.id }

    { attachment: attachment, event: event }
  end
end
