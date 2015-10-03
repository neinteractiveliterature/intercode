ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' # Set up gems listed in the Gemfile.

require 'rails/commands/server'
module Rails
  class Server
    # Intercode uses different domain names for different conventions, so we'll need to
    # bind to 0.0.0.0 rather than just localhost by default.
    def default_options
      super.merge(Host:  '0.0.0.0', Port: 3000)
    end
  end
end