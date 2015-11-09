ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActionController::TestCase
  include Devise::TestHelpers

  def set_convention(convention)
    @request.host = convention.domain
    @controller.env["intercode.convention"] = convention
  end
end