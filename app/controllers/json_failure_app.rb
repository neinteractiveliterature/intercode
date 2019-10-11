class JsonFailureApp < Devise::FailureApp
  # never redirect
  def respond
    http_auth
    response.media_type = 'application/json'
  end

  def http_auth_body
    { error: i18n_message }.to_json
  end
end
