# frozen_string_literal: true
require "test_helper"

describe SitemapsController do
  let(:convention) { create(:convention) }

  def sitemap_urls
    xml = Nokogiri.XML(response.body)
    xml.remove_namespaces!
    xml.xpath("//url").map { |url| [url.at_xpath("loc").text, url.at_xpath("lastmod")&.text] }
  end

  def locations
    sitemap_urls.map(&:first)
  end

  describe "GET show for a convention" do
    setup { set_convention convention }

    it "is a sitemap in XML" do
      get :show

      assert_response :success
      assert_equal "application/xml", response.media_type
      assert_equal "urlset", Nokogiri.XML(response.body).root.name
      assert_equal "http://www.sitemaps.org/schemas/sitemap/0.9", Nokogiri.XML(response.body).root.namespace.href
    end

    it "is empty for a convention with no pages and no events" do
      get :show

      assert_empty locations
    end

    it "lists pages with when they were last changed" do
      page = create(:page, parent: convention, slug: "about")

      get :show

      assert_equal [["http://#{convention.domain}/pages/about", page.updated_at.xmlschema]], sitemap_urls
    end

    it "lists the root page at the root of the site" do
      page = create(:page, parent: convention, slug: "welcome")
      convention.update!(root_page: page)

      get :show

      assert_equal ["http://#{convention.domain}/"], locations
    end

    it "leaves out pages hidden from search" do
      create(:page, parent: convention, slug: "visible")
      create(:page, parent: convention, slug: "secret", hidden_from_search: true)

      get :show

      assert_equal ["http://#{convention.domain}/pages/visible"], locations
    end

    it "lists the events pages, the schedule and each active event once there are events" do
      event = create(:event, convention:, title: "Dragon Hunt")
      create(:run, event:)

      get :show

      assert_includes locations, "http://#{convention.domain}/events"
      assert_includes locations, "http://#{convention.domain}/events/schedule"
      assert_includes locations, "http://#{convention.domain}/events/#{event.to_param}"
    end

    it "says the events lists were last changed when the latest event or run was" do
      event = create(:event, convention:)
      run = create(:run, event:)
      run.update_columns(updated_at: 1.day.from_now) # rubocop:disable Rails/SkipsModelValidations

      get :show

      events_entry = sitemap_urls.find { |location, _lastmod| location.end_with?("/events") }
      assert_equal run.reload.updated_at.xmlschema, events_entry.last
    end

    it "leaves out dropped events" do
      create(:event, convention:, title: "Kept")
      dropped = create(:event, convention:, title: "Dropped", status: "dropped")

      get :show

      assert_not_includes locations, "http://#{convention.domain}/events/#{dropped.to_param}"
    end

    it "leaves out the event pages when every event has been dropped" do
      create(:event, convention:, status: "dropped")

      get :show

      assert_not_includes locations, "http://#{convention.domain}/events"
    end

    it "does not include another convention's pages" do
      create(:page, parent: create(:convention), slug: "elsewhere")

      get :show

      assert_empty locations
    end
  end

  describe "GET show for the root site" do
    setup { @request.host = "root.example.com" }

    it "lists the root site's pages and none of the convention things" do
      root_site = create(:root_site)
      root_site.pages.create!(name: "About us", slug: "about-us", content: "Hello")

      get :show

      assert_response :success
      assert_includes locations, "http://root.example.com/pages/about-us"
      assert_not(locations.any? { |location| location.include?("/events") })
    end
  end
end
