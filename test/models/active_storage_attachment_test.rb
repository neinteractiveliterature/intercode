# frozen_string_literal: true

require "test_helper"

class ActiveStorageAttachmentTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:event) { create(:event, convention:) }

  it "can generate a resized variant of an attached image" do
    event.images.attach(
      io: Rails.root.join("test/files/war_bond.png").open,
      filename: "war_bond.png",
      content_type: "image/png"
    )

    attachment = event.images.first
    assert attachment.representable?, "Expected PNG attachment to be representable"

    # Exercises image_processing - calls into the vips pipeline via resize_to_limit.
    # This is the same operation used by ActiveStorageAttachmentType#resized_url.
    variant = attachment.representation(resize_to_limit: [100, 100]).processed
    assert variant.present?
  end
end
