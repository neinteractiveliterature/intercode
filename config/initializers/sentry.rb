# frozen_string_literal: true
if ENV["SENTRY_DSN"].present?
  Sentry.init do |config|
    config.dsn = ENV.fetch("SENTRY_DSN")
    config.release = "intercode-#{ENV.fetch("REVISION")}" if ENV["REVISION"].present?

    config.traces_sample_rate = ENV.fetch("SENTRY_TRACES_SAMPLE_RATE", "0").to_f
    config.profiles_sample_rate = ENV.fetch("SENTRY_PROFILES_SAMPLE_RATE", "0").to_f

    # What Sentry collects from requests. send_default_pii is deprecated in favor of data_collection, and Sentry 8 will
    # default data_collection to being far more permissive, so this states what we've been getting all along (the
    # values that send_default_pii = false maps to in Sentry 7) instead of leaving it to the SDK's defaults.
    pii_header_terms = %w[forwarded -ip _ip remote via _user -user]
    data_collection = config.data_collection
    data_collection.user_info = false
    data_collection.cookies = false
    data_collection.http_headers.request.mode = :deny_list
    data_collection.http_headers.request.terms = pii_header_terms
    data_collection.http_headers.response.mode = :deny_list
    data_collection.http_headers.response.terms = pii_header_terms
    data_collection.http_bodies = []
    data_collection.url_query_params = false
    data_collection.graphql.document = false
    data_collection.graphql.variables = false
    data_collection.database_query_data = false
    data_collection.queues = false
  end
end
