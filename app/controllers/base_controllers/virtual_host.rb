module BaseControllers
  class VirtualHost < ApplicationController
    before_filter :ensure_con_host
    
    protected
    def con
      @con ||= Con.find_by_domain(request.host)
    end
    
    def ensure_con_host
      unless con
        logger.warn "Request domain #{request.host} doesn't match any cons!  Redirecting."
        redirect_to root_url(:host => Intercode::Application.config.intercode_global_hosts.first)
      end
    end

    def liquid_assigns
      super.merge("con" => con)
    end
  end
end