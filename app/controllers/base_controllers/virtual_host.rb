module BaseControllers
  class VirtualHost < ApplicationController
    protected
    def convention
      @convention ||= env["intercode.convention"]
    end

    def liquid_assigns
      super.merge("convention" => convention)
    end
  end
end