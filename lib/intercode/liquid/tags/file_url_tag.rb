module Intercode
  module Liquid
    module Tags
      # Given the filename of an uploaded file, outputs a URL for viewing or downloading that file.
      #
      # @liquid_tag_name FileUrlTag
      class FileUrlTag < ::Liquid::Tag
        attr_reader :filename

        def initialize(tag_name, args, tokens)
          super
          @filename = args.strip.gsub(/\A(["'])(.*)\1\z/, '\2')
        end

        def render(context)
          return unless context.registers['controller']

          cache = context.registers[:cached_files] || {}
          cms_file = cache[filename]
          if cms_file
            attachment = cms_file.file
          else
            parent = context.registers['parent']
            parent = nil if parent.is_a?(RootSite)
            attachment =
              ActiveStorage::Attachment
                .joins(:blob)
                .where(active_storage_blobs: { filename: }, record: CmsFile.where(parent:))
                .first
            return "Error: file #{filename} not found" unless attachment
          end

          context.registers['controller'].cdn_upload_url(attachment)
        end
      end
    end
  end
end

Liquid::Template.register_tag('file_url', Intercode::Liquid::Tags::FileUrlTag)
