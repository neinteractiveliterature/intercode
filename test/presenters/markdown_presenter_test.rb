# frozen_string_literal: true
require "test_helper"

class MarkdownPresenterTest < ActiveSupport::TestCase
  let(:controller) { Class.new { def cdn_upload_url(image) = "https://cdn.example.com/#{image}" }.new }
  let(:presenter) { MarkdownPresenter.new("", controller:) }

  describe "local images" do
    it "resolves local images per render call rather than sticking with the first call's images" do
      markdown = "![a picture](pic.png)"

      without_image = presenter.render(markdown, local_images: {})
      with_image = presenter.render(markdown, local_images: { "pic.png" => "ATTACHMENT" })

      assert_includes without_image, "/images/pic.png"
      assert_includes with_image, "https://cdn.example.com/ATTACHMENT"
    end
  end
end
