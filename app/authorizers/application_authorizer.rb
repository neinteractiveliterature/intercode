# This is the base authorizer that Authority generated upon installation.
class ApplicationAuthorizer < Authority::Authorizer

  # Any class method from Authority::Authorizer that isn't overridden
  # will call its authorizer's default method.
  #
  # In Intercode we're setting it up so that site admins can do anything;
  # everyone else has to perform real permissions checks.
  #
  # @param [Symbol] adjective; example: `:creatable`
  # @param [Object] user - whatever represents the current user in your app
  # @return [Boolean]
  def self.default(adjective, user)
    user.site_admin?
  end

end
