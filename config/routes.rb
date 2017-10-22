require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  post "/graphql", to: "graphql#execute"
  devise_for :users, controllers: { registrations: "registrations" }

  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    # all the /pages/* routes that Cadmus provides
    cadmus_pages

    # http://con.domain/ will go to the root page of the con
    root :to => 'pages#root', :as => 'con_root'

    resource :convention

    resource :ticket, only: [:new, :show, :create]
    resources :ticket_types, except: [:show]

    resources :events do
      collection do
        get 'schedule(/*extra)' => :schedule, as: :schedule
        get 'schedule_with_counts(/*extra)' => :schedule_with_counts, as: :schedule_with_counts
      end

      resources :team_members, except: [:show]

      resources :runs, only: [] do
        resource :user_signup
        resources :admin_signups
      end
    end

    get 'admin_events/(*extra)' => 'admin_events#index', as: :admin_events

    resources :event_proposals do
      member do
        patch :submit
      end
    end
    resources :admin_event_proposals

    resources :user_con_profiles do
      member do
        post :become
      end

      resource :admin_ticket, only: [:new, :create, :edit, :update, :destroy]
    end

    resources :cms_partials
    resources :cms_files
    resources :cms_navigation_items

    resource :my_profile do
      member do
        get :edit_bio
      end
    end

    namespace :reports do
      get :per_event
      get :per_user
      get :per_room
      get :volunteer_events
      get :events_by_time
    end

    resources :rooms, only: [:index]

    resources :staff_positions
    resources :forms, only: [:show]
  end

  # the following routes apply only when we're not in a virtual host
  resources :conventions
  resources :users
  root :to => 'conventions#index'
end
