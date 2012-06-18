module Intercode
  class GlobalHostConstraint
    def initialize
      @global_hosts = Set.new(Intercode::Application.config.intercode_global_hosts)
    end

    def matches?(request)
      @global_hosts.include?(request.host)
    end
  end
  
  class VirtualHostConstraint < GlobalHostConstraint
    def matches?(request)
      !super
    end
  end
end