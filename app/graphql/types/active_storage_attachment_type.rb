class Types::ActiveStorageAttachmentType < Types::BaseObject
  field :id, ID, null: false
  field :filename, String, null: false
  field :url, String, null: false
  field :content_type, String, null: false
  field :byte_size, Int, null: false
  field :resized_url, String, null: false do
    argument :max_width, Int, required: true
    argument :max_height, Int, required: true
  end

  def url
    context[:controller].rails_representation_url(object)
  end

  def resized_url(max_width:, max_height:)
    context[:controller].rails_representation_url(object.representation(resize_to_limit: [max_width, max_height]))
  end
end
