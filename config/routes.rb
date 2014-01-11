require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
  devise_for :users
  
  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    # all the /pages/* routes that Cadmus provides
    cadmus_pages
    
    # http://con.domain/ will go to the root page of the con
    root :to => 'pages#root', :as => 'con_root'

    # Define "resource-ful" routes for events.  This will define the
    # following paths:
    #
    # Action        HTTP Verb   Named Path             URL path
    # ======        =========   ==========             ========
    # index         GET         events_path            /events
    # new           GET         new_events_path        /events/new
    # create        POST        events_path            /events
    # show          GET         events_path(:id)       /events/:id
    # edit          GET         edit_events_path(:id)  /events/:id/edit
    # update        PATCH/PUT   events_path(:id)       /events/:id
    # destroy       DELETE      events_path(:id)       /events/:id
    resources :events

  end

  # the following routes apply only when we're not in a virtual host
  resources :conventions
  root :to => 'conventions#index'
end
