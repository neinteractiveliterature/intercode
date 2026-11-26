# frozen_string_literal: true
require "test_helper"

describe CmsRenderingContext do
  let(:convention) { create(:convention) }
  let(:rendering_context) do
    CmsRenderingContext.new(cms_parent: convention, controller: nil, timezone: ActiveSupport::TimeZone["UTC"])
  end
  let(:partial_lookup) { /FROM "cms_partials" WHERE .*"cms_partials"."name" = / }

  before do
    create(:cms_partial, parent: convention, name: "inner", content: "inner text")
    create(:cms_partial, parent: convention, name: "outer", content: "outer, {% render 'inner' %}")
  end

  it "renders a page's partials without looking each one up by name" do
    page = create(:page, parent: convention, content: "{% render 'outer' %} and {% include 'inner' %}")

    assert_no_queries_match(partial_lookup) do
      assert_equal "outer, inner text and inner text", rendering_context.render_page_content(page)
    end
  end

  it "renders a layout's partials without looking each one up by name" do
    layout = create(:cms_layout, parent: convention, content: "{% render 'outer' %}")

    assert_no_queries_match(partial_lookup) do
      assert_equal "outer, inner text", rendering_context.render_layout_content(layout, {})
    end
  end

  it "renders file URLs for a page's files without looking each one up by name" do
    cms_file = create(:cms_file, parent: convention)
    controller = Object.new
    def controller.cdn_upload_url(attachment) = "/uploads/#{attachment.filename}"
    context = CmsRenderingContext.new(cms_parent: convention, controller:, timezone: ActiveSupport::TimeZone["UTC"])
    page = create(:page, parent: convention, content: "{% file_url war_bond.png %}")
    assert_equal [cms_file], page.cms_files.to_a

    assert_no_queries_match(/"active_storage_blobs"."filename" = /) do
      assert_equal "/uploads/war_bond.png", context.render_page_content(page)
    end
  end

  it "still looks up a partial that wasn't preloaded" do
    file_system = PreloadedPartialFileSystem.new(convention, { "outer" => "preloaded" })

    assert_equal "preloaded", file_system.read_template_file("outer")
    assert_equal "inner text", file_system.read_template_file("inner")
  end
end
