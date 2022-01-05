# frozen_string_literal: true
module ApplicationHelper
  DEFAULT_NAVBAR_CLASSES = 'navbar-fixed-top navbar-expand-md mb-4 navbar-dark bg-intercode-blue'

  def self.obfuscated_email(address)
    address.gsub('.', ' DOT ').gsub('@', ' AT ')
  end

  def page_title
    parts = []

    parts << @page_title if @page_title.present?
    parts << @event.title if @event

    parts << (@convention ? @convention.name : 'Intercode')

    parts.join(' - ')
  end

  def open_graph_description_for_page(page)
    Rails
      .cache
      .fetch(['open_graph_description', page], expires_in: 1.day) do
        strip_tags(cms_rendering_context.render_page_content(@page)).gsub(/\s+/, ' ').strip.truncate(160)
      end
  end

  def url_with_possible_host(path, host)
    return path if host.blank?

    "#{request.scheme}://#{host}#{path}"
  end
end
