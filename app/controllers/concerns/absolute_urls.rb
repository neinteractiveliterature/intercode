module AbsoluteUrls
  def default_url_scheme
    Rails.env.production? ? 'https' : 'http'
  end

  def url_with_host(url, host, scheme: nil)
    uri = URI(url)
    uri.host = host
    uri.scheme = (scheme || default_url_scheme)
    uri.to_s
  end

  def url_with_convention_host(url, convention)
    url_with_host(url, convention.domain)
  end
end
