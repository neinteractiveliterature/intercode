module Intercode
  module Liquid
    module Tags
      class FileUrlTag < ::Liquid::Tag
        attr_reader :filename

        def initialize(tag_name, args, tokens)
          super
          @filename = args.strip.gsub(/\A(["'])(.*)\1\z/, '\2')
        end

        def render(context)
          cache = context.registers[:cached_files] || {}
          cms_file = cache[filename]
          if cms_file
            attachment = cms_file.as_file
          else
            parent = context.registers['parent']
            attachment =
              ActiveStorage::Attachment
                .joins(:blob)
                .where(active_storage_blobs: { filename: filename }, record: CmsFile.where(parent: parent))
                .first
            return "Error: file #{filename} not found" unless attachment
          end

          context.registers['controller'].rails_representation_url(attachment)
        end
      end
    end
  end
end

Liquid::Template.register_tag('file_url', Intercode::Liquid::Tags::FileUrlTag)
