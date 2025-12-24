# frozen_string_literal: true
class SinglePageAppController < ApplicationController
  def root
    doc = Nokogiri::HTML.parse(get_index_html_content)
    doc.css('link[href]').each do |link_tag|
      link_tag['href'] = URI.join(request.url, asset_host, link_tag['href']).to_s
    end

    global_config_script_tag = doc.create_element('script', Nokogiri::XML::Text.new(global_config_js, doc))
    doc.css('head').first.prepend_child(global_config_script_tag)

    doc.css('body script').each do |script_tag|
      script = script_tag.inner_text
      next unless script.start_with?("import ")

      script.gsub!(/\/assets.*\.js/) { |match| URI.join(request.url, asset_host, match).to_s }
      script_tag.inner_html = Nokogiri::XML::Text.new(script, doc)
    end
    self.response_body = doc.to_s
  end

  private

  def get_index_html_content
    if false && Rails.env.development?
      Faraday.get(URI.join(request.url, asset_host, "/")).body
    else
      File.read(Rails.root.join('build', 'client', 'index.html'))
    end
  end

  def global_config_js
    <<~JS
    window.intercodeAssetsHost = #{asset_host.to_json};

    function intercodeAssetURL(filename) {
      if (window.intercodeAssetsHost) {
        return `//${window.intercodeAssetsHost}/packs/${filename}`;
      } else {
        return `/packs/${filename}`;
      }
    }

    window.__intercodeAssetURL = intercodeAssetURL;
    JS
  end
end
