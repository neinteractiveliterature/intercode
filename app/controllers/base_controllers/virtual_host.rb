module BaseControllers
  class VirtualHost < ApplicationController
    before_filter :ensure_virtual_host
    before_filter :con
    
    protected
    def virtual_host
      @virtual_host ||= VirtualHost.find_by_domain(request.domain)
    end
  
    def con
      @con ||= virtual_host.con if virtual_host
    end
    
    def ensure_virtual_host
      unless @virtual_host
        logger.warn "Request domain #{request.domain} doesn't match any virtual hosts!  Redirecting."
        redirect_to root_url(:host => Intercode::Application.config.intercode_global_hosts.first)
      end
    end
  end
end