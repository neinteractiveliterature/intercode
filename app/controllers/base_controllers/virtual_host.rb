module BaseControllers
  
  # This is an abstract base class for controllers that deal with actions for a particular Convention.
  # In theory that should be most things in this app.  It defines a couple convenience methods, most
  # notably a method called convention, which returns the current Convention object for the domain
  # name being requested.
  class VirtualHost < ApplicationController
    
    protected
    
    # Returns the appropriate Convention object for the domain name of the request.  This relies on
    # the Intercode::FindVirtualHost Rack middleware having already run, since it sets the key
    # "intercode.convention" inside the Rack environment.
    def convention
      @convention ||= env["intercode.convention"]
    end
    helper_method :convention

    # Make the current convention object available to CMS templates, so they can do, for example:
    # <h1>Welcome to {{ convention.name }}, {{ user.name }}!</h1>
    def liquid_assigns
      super.merge("convention" => convention)
    end
  end
  
end
