module BaseControllers
  class VirtualHost < ApplicationController
    protected
    def con
      @con ||= env["intercode.con"]
    end

    def liquid_assigns
      super.merge("con" => con)
    end
  end
end