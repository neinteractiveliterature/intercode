require 'intercode/liquid/tags'

# In development and test mode, expose the actual exception to developers if there is one
if Rails.env.development? || Rails.env.test?
  Liquid::Template.default_exception_renderer = lambda do |exception|
    exception.is_a?(Liquid::InternalError) ? "Liquid error: #{ERB::Util.html_escape exception.cause.message}" : exception
  end
end