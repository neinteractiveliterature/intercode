# We set the cookie domain dynamically with a Rack middleware.
# See lib/intercode/dynamic_cookie_domain.rb for how this works.

Rails.application.config.session_store :active_record_store, key: '_intercode_session', domain: :all
