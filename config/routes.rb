require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
  devise_for :users
  
  constraints(Intercode::VirtualHostConstraint.new) do
    # all the /pages/* routes that Cadmus provides
    cadmus_pages
    
    # http://con.domain/ will go to the root page of the con
    root :to => 'pages#root'
  end

  # the following routes apply only when we're not in a virtual host
  resources :cons
  root :to => 'cons#index'
end
