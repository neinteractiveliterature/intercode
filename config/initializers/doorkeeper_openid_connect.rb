Doorkeeper::OpenidConnect.configure do
  issuer(
    "#{Rails.env.production? ? 'https' : 'http'}://#{Rails.application.config.action_mailer.default_url_options[:host]}"
  )

  signing_key ENV.fetch('OPENID_CONNECT_SIGNING_KEY', nil)&.gsub('\n', "\n")

  subject_types_supported [:public]

  resource_owner_from_access_token { |access_token| User.find_by(id: access_token.resource_owner_id) }

  auth_time_from_resource_owner(&:current_sign_in_at)

  reauthenticate_resource_owner do |resource_owner, return_to|
    store_location_for resource_owner, return_to
    sign_out resource_owner
    redirect_to new_user_session_url
  end

  subject { |resource_owner, _application| resource_owner.id }

  # Protocol to use when generating URIs for the discovery endpoint,
  # for example if you also use HTTPS in development
  # protocol do
  #   :https
  # end

  # Expiration time on or after which the ID Token MUST NOT be accepted for processing. (default 120 seconds).
  # expiration 600

  # Example claims:
  # claims do
  #   normal_claim :_foo_ do |resource_owner|
  #     resource_owner.foo
  #   end

  #   normal_claim :_bar_ do |resource_owner|
  #     resource_owner.bar
  #   end
  # end
end
