module Intercode
  module Liquid
    module Tags
      class FileUrl < ::Liquid::Tag
        include Rails.application.routes.url_helpers

        attr_reader :filename

        def initialize(tag_name, args, tokens)
          super
          @filename = args.strip.gsub(/\A([\"\'])(.*)\1\z/, '\2')
        end

        def render(context)
          context.registers["convention"].cms_files.find_by!(file: filename).file.url
        end
      end
    end
  end
end

Liquid::Template.register_tag('file_url', Intercode::Liquid::Tags::FileUrl)