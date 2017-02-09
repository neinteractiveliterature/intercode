require 'intercode/liquid/tags'
require 'intercode/liquid/filters'
require 'intercode/liquid/cms_partial_file_system'

Liquid::Template.file_system = Intercode::Liquid::CmsPartialFileSystem.new

# In development and test mode, expose the actual exception to developers if there is one
if Rails.env.development? || Rails.env.test?
  Liquid::Template.default_exception_renderer = lambda do |exception|
    exception.is_a?(Liquid::InternalError) ? "Liquid error: #{ERB::Util.html_escape exception.cause.message}" : exception
  end
end