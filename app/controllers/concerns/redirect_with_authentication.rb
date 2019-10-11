module RedirectWithAuthentication
  private

  def redirect_with_authentication(view)
    destination = URI(session[:user_return_to] || root_path)
    dest_params = Rack::Utils.parse_query(destination.query).merge('show_authentication' => view)
    destination.query = dest_params.to_query.presence
    redirect_to(destination.to_s)
  end
end
