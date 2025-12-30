Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins do |source, env|
      if env["intercode.convention"]
        true
      else
        source_uri =
          begin
            URI.parse(source)
          rescue StandardError
            nil
          end

        host = source_uri&.host
        if host == ENV["INTERCODE_HOST"]
          true
        else
          # this might be a request to a backend-only domain where the browser is on a frontend page
          Convention.find_by(domain: host).present?
        end
      end
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
