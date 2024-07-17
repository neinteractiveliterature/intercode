class Mutations::AttachImageToEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false
  field :attachment, Types::ActiveStorageAttachmentType, null: false

  argument :id, ID, required: false
  argument :signed_blob_id, ID, required: true

  load_and_authorize_convention_associated_model :event_proposals, :id, :update

  def resolve(signed_blob_id:, **_args)
    blob = ActiveStorage::Blob.find_signed!(signed_blob_id)
    event_proposal.images.attach(blob)
    event_proposal.save!

    attachment = event_proposal.images.attachments.find { |att| att.blob_id == blob.id }

    { attachment: attachment, event_proposal: event_proposal }
  end
end
