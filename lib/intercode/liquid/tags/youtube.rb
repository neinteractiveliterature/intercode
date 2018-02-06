module Intercode
  module Liquid
    module Tags
      class Youtube < ::Liquid::Tag
        attr_reader :video_id

        def initialize(tag_name, video_id, _options)
          super
          @video_id = video_id.gsub(/[^A-Za-z0-9_-]/, '')
        end

        def render(_context)
          <<-HTML
          <iframe type="text/html" width="640" height="390"
            src="http://www.youtube.com/embed/#{video_id}?enablejsapi=1&origin=http://example.com"
            frameborder="0"></iframe>
          HTML
        end
      end
    end
  end
end

Liquid::Template.register_tag('youtube', Intercode::Liquid::Tags::Youtube)
