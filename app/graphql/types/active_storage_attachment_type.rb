class Types::ActiveStorageAttachmentType < Types::BaseObject
  field :byte_size, Int, null: false
  field :content_type, String, null: false
  field :filename, String, null: false
  field :id, ID, null: false
  field :resized_url, String, null: true do
    argument :max_height, Int, required: true
    argument :max_width, Int, required: true
  end
  field :url, String, null: false

  def url
    context[:controller].cdn_upload_url(object)
  end

  def resized_url(max_width:, max_height:)
    return nil unless object.representable?

    context[:controller].cdn_upload_url(object.representation(resize_to_limit: [max_width, max_height]))
  end
end
