class SitemapsController < ApplicationController
  def show
    sitemap =
      Nokogiri::XML::Builder.new(encoding: 'UTF-8') do |xml|
        xml.urlset xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' do
          cms_parent.pages.each do |page|
            next if page.hidden_from_search

            xml.url do
              xml.loc(cms_parent.root_page == page ? root_url : root_url(extra: "pages/#{page.slug}"))
              xml.lastmod(page.updated_at.xmlschema)
            end
          end

          generate_convention_sitemap(xml) if convention
        end
      end

    render xml: sitemap
  end

  private

  def generate_convention_sitemap(xml)
    events_updated = [convention.events.active.maximum(:updated_at), convention.runs.maximum(:updated_at)].compact.max
    return unless events_updated

    xml.url do
      xml.loc(root_url(extra: 'events'))
      xml.lastmod(events_updated.xmlschema)
    end

    xml.url do
      xml.loc(root_url(extra: 'events/schedule'))
      xml.lastmod(events_updated.xmlschema)
    end

    generate_convention_event_pages_sitemap(xml)
  end

  def generate_convention_event_pages_sitemap(xml)
    convention.events.active.each do |event|
      xml.url do
        xml.loc(root_url(extra: "events/#{event.to_param}"))
        xml.lastmod(event.updated_at.xmlschema)
      end
    end
  end
end
