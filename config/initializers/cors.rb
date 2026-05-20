# frozen_string_literal: true
# rubocop:disable Metrics/BlockLength
# FindVirtualHost is inserted after ActionDispatch::Executor in application.rb, so
# env["intercode.convention"] is set before Rack::Cors runs its origin check.
Rails.application.config.middleware.insert_after Intercode::FindVirtualHost, Rack::Cors do
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
        intercode_host = ENV.fetch("INTERCODE_HOST", nil)
        # Allow INTERCODE_HOST itself and convention subdomains (e.g. for OIDC discovery from a convention page)
        if host == intercode_host || (intercode_host && host&.end_with?(".#{intercode_host}"))
          true
        else
          # this might be a request to a backend-only domain where the browser is on a frontend page
          Convention.find_by(domain: host).present?
        end
      end
    end

    resource "/authenticity_tokens", methods: %i[get], credentials: true, headers: :any
    resource "/graphql", methods: %i[post], credentials: true, headers: :any
    resource "/users/sign_out", methods: %i[get delete], credentials: true, headers: :any
    resource "/rails/active_storage/direct_uploads", methods: %i[post]
    resource "*", headers: :any, methods: %i[get put post delete]
  end

  # allow do
  #   origins "*"
  #   resource "*", headers: :any, methods: %i[get]
  # end
end
# rubocop:enable Metrics/BlockLength
