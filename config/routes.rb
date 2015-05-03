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
    # Action        HTTP Verb   Named Path            URL path
    # ======        =========   ==========            ========
    # index         GET         events_path           /events
    # new           GET         new_event_path        /events/new
    # create        POST        event_path            /events
    # show          GET         event_path(:id)       /events/:id
    # edit          GET         edit_event_path(:id)  /events/:id/edit
    # update        PATCH/PUT   event_path(:id)       /events/:id
    # destroy       DELETE      event_path(:id)       /events/:id
    #
    # Note that you get (mostly) get this table using the command
    #   rake routes
    resources :events

    # Routes for team_members (GMs)
    resources :team_members
    
    # Routes for user con profiles
    resources :user_con_profiles
  end

  # the following routes apply only when we're not in a virtual host
  resources :conventions
  resources :users
  root :to => 'conventions#index'
end
