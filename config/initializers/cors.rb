Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins do |source, env|
      return true if env["intercode.convention"]

      # Check if the origin's host matches INTERCODE_HOST
      source_uri =
        begin
          URI.parse(source)
        rescue StandardError
          nil
        end
      source_uri&.host == ENV["INTERCODE_HOST"]
    end

    resource "/authenticity_tokens", methods: %i[get], credentials: true, headers: :any
    resource "/graphql", methods: %i[post], credentials: true, headers: :any
    resource "/users/sign_out", methods: %i[delete], credentials: true, headers: :any
    resource "/rails/active_storage/direct_uploads", methods: %i[post]
    resource "*", headers: :any, methods: %i[get put post delete]
  end

  # allow do
  #   origins "*"
  #   resource "*", headers: :any, methods: %i[get]
  # end
end
Rails.application.config.middleware.insert_before 0, Intercode::FindVirtualHost
