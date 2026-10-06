# frozen_string_literal: true
require "test_helper"

class ExportCmsContentSetServiceTest < ActiveSupport::TestCase
  # Exports go to a temporary directory instead of the app's cms_content_sets folder (there is no `around` here, so
  # the whole run of each test is wrapped instead)
  def run(...)
    Dir.mktmpdir do |dir|
      @root = dir
      CmsContentSet.stub(:root_path, dir) { super }
    end
  end

  let(:convention) { create(:convention) }

  def export(name = "exported", inherit: [], **)
    ExportCmsContentSetService.new(convention:, content_set_name: name, inherit:, **).call
  end

  def exported_path(*parts)
    File.join(@root, "exported", *parts)
  end

  def metadata
    YAML.safe_load_file(exported_path("metadata.yml"))
  end

  describe "validation" do
    it "needs a name for the content set" do
      result = export("")

      assert_not result.success?
      assert_includes result.errors.full_messages.join, "Content set name"
    end

    it "refuses to overwrite a folder that already exists" do
      FileUtils.mkdir_p(File.join(@root, "exported"))

      result = export

      assert_not result.success?
      assert_includes result.errors.full_messages.join, "already exists"
    end
  end

  describe "exporting a convention" do
    it "creates the content set's folder and a metadata file" do
      result = export

      assert result.success?
      assert File.directory?(exported_path)
      assert File.exist?(exported_path("metadata.yml"))
    end

    it "records what the content set inherits from" do
      export(inherit: [])

      assert_equal [], metadata["inherit"]
    end

    it "exports the root page and default layout by name" do
      layout = create(:cms_layout, parent: convention, name: "Main layout")
      page = create(:page, parent: convention, name: "Welcome", slug: "welcome", cms_layout: layout)
      convention.update!(root_page: page, default_layout: layout)

      export

      assert_equal "welcome", metadata["root_page_slug"]
      assert_equal "Main layout", metadata["default_layout_name"]
    end

    it "leaves out the root page and layout when the convention has none" do
      export

      assert_not metadata.key?("root_page_slug")
      assert_not metadata.key?("default_layout_name")
    end

    it "exports variables in key order" do
      create(:cms_variable, parent: convention, key: "zebra", value: "z")
      create(:cms_variable, parent: convention, key: "apple", value: "a")

      export

      assert_equal({ "apple" => "a", "zebra" => "z" }, metadata["variables"])
      assert_equal %w[apple zebra], metadata["variables"].keys
    end

    it "exports navigation items, nested, in position order" do
      page = create(:page, parent: convention, slug: "about")
      section = create(:cms_navigation_item, parent: convention, title: "Section", position: 2)
      create(:cms_navigation_item, parent: convention, title: "First", position: 1, page:)
      create(:cms_navigation_item, parent: convention, title: "Nested", navigation_section: section, position: 1)

      export

      titles = metadata["navigation_items"].pluck("title")
      assert_equal %w[First Section], titles
      assert_equal "about", metadata["navigation_items"].first["page_slug"]
      assert_equal(["Nested"], metadata["navigation_items"].last["navigation_links"].pluck("title"))
    end

    it "writes pages, partials and layouts to their folders" do
      create(:page, parent: convention, name: "About", slug: "about", content: "About us")
      create(:cms_partial, parent: convention, name: "footer", content: "Goodbye")
      create(:cms_layout, parent: convention, name: "Main", content: "<html>{{ content }}</html>")

      export

      assert_includes File.read(exported_path("pages", "about.liquid")), "About us"
      assert_includes File.read(exported_path("partials", "footer.liquid")), "Goodbye"
      assert_equal 1, Dir.glob(exported_path("layouts", "*")).size
    end

    it "exports the site's own content for a convention-less (root site) export" do
      create(:root_site).pages.create!(name: "Root page", slug: "root-page", content: "Root!")

      ExportCmsContentSetService.new(convention: nil, content_set_name: "exported", inherit: []).call!

      assert_includes File.read(exported_path("pages", "root-page.liquid")), "Root!"
    end
  end

  describe "inheriting" do
    before do
      create(:page, parent: convention, name: "Same", slug: "same", content: "Unchanged content")
      create(:page, parent: convention, name: "Changed", slug: "changed", content: "Original content")
      ExportCmsContentSetService.new(convention:, content_set_name: "base", inherit: []).call!
      convention.pages.find_by!(slug: "changed").update!(content: "Edited content")
      convention.reload
    end

    it "leaves out items that are the same as the inherited version" do
      export("exported", inherit: ["base"])

      assert_not File.exist?(exported_path("pages", "same.liquid"))
    end

    it "keeps items that differ from the inherited version" do
      export("exported", inherit: ["base"])

      assert_includes File.read(exported_path("pages", "changed.liquid")), "Edited content"
    end

    it "ignores whitespace around attribute values when comparing" do
      convention.pages.find_by!(slug: "same").update!(content: "  Unchanged content \n")
      convention.reload

      export("exported", inherit: ["base"])

      assert_not File.exist?(exported_path("pages", "same.liquid"))
    end

    it "records the inherited sets in the metadata" do
      export("exported", inherit: ["base"])

      assert_equal ["base"], metadata["inherit"]
    end

    it "exports everything when nothing is inherited" do
      export("exported", inherit: [])

      assert File.exist?(exported_path("pages", "same.liquid"))
      assert File.exist?(exported_path("pages", "changed.liquid"))
    end
  end

  describe "round trip" do
    it "can be loaded into another convention" do
      create(:page, parent: convention, name: "About", slug: "about", content: "About us")
      create(:cms_partial, parent: convention, name: "footer", content: "Goodbye")
      create(:cms_variable, parent: convention, key: "greeting", value: "hello")
      export

      other = create(:convention)
      other.forms.destroy_all
      other.update!(user_con_profile_form: nil)
      LoadCmsContentSetService.new(convention: other, content_set_name: "exported").call!

      assert_equal "About us", other.pages.find_by!(slug: "about").content.strip
      assert_equal "Goodbye", other.cms_partials.find_by!(name: "footer").content.strip
      assert_equal "hello", other.cms_variables.find_by!(key: "greeting").value
    end
  end
end
