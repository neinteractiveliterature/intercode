module Intercode
  module Liquid
    # An implementation of Liquid's FileSystem interface that lets it read partials from the CmsPartial model
    class CmsPartialFileSystem
      def read_template_file(template_path)
        CmsPartial.find_by!(identifier: template_path).content
      end
    end
  end
end