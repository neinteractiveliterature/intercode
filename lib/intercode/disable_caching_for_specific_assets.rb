# adapted from https://stackoverflow.com/a/52848885
module Intercode
  class DisableCachingForSpecificAssets
    attr_reader :app, :asset_paths

    def initialize(app, asset_paths)
      @app = app
      @asset_paths = Set.new(asset_paths)
    end

    def call(env)
      # Let the next middleware classes & app do their thing first…
      status, headers, response = app.call(env)

      # …and modify the response if a cache-disabled asset was fetched.
      if asset_paths.include?(env['REQUEST_PATH'])
        headers['Cache-Control'] = 'no-cache'
        headers.except!('Expires')
      end

      [status, headers, response]
    end
  end
end
