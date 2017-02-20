module Intercode
  module Liquid
    module Tags
      class PageUrl < ::Liquid::Tag
        include Rails.application.routes.url_helpers

        attr_reader :page_name

        def initialize(tag_name, args, tokens)
          super
          @page_name = args.strip
        end

        def render(context)
          page_path(page_name)
        end
      end
    end
  end
end

Liquid::Template.register_tag('page_url', Intercode::Liquid::Tags::PageUrl)