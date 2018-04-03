require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?

  post '/graphql', to: 'graphql#execute'
  devise_for :users, controllers: {
    passwords: 'passwords',
    registrations: 'registrations',
    sessions: 'sessions'
  }

  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    # all the /pages/* routes that Cadmus provides
    cadmus_pages

    # http://con.domain/ will go to the root page of the con
    root to: 'pages#root', as: 'con_root'

    resource :convention

    resource :ticket, only: [:new, :show, :create]
    get 'ticket_types/(*extra)' => 'ticket_types#index', as: :ticket_types

    resources :events do
      collection do
        get 'schedule(/*extra)' => :schedule, as: :schedule
        get 'schedule_with_counts(/*extra)' => :schedule_with_counts, as: :schedule_with_counts
      end

      resources :team_members, except: [:show]

      resources :runs, only: [] do
        member do
          get :signup_summary
        end

        resource :user_signup
        resources :admin_signups
      end
    end

    get 'admin_events/(*extra)' => 'admin_events#index', as: :admin_events

    resources :event_proposals, except: [:update]
    resources :admin_event_proposals

    resources :products, only: [:show]
    resource :cart, only: [:show]
    resource :order_history, only: [:show]
    resources :admin_orders, only: [:index] do
      collection do
        get :export
      end
    end
    resources :admin_products, only: [:index]

    resources :user_con_profiles, only: [:index, :show, :edit, :destroy] do
      member do
        post :become
      end

      resource :admin_ticket, only: [:new, :create, :edit, :update, :destroy]
    end

    resources :cms_partials
    resources :cms_files
    resources :cms_navigation_items do
      collection do
        patch :sort
      end
    end
    resources :cms_layouts

    resource :my_profile do
      member do
        get :edit_bio
        patch :update_bio
      end
    end

    get 'reports' => 'reports#index'
    namespace :reports do
      get :attendance_by_payment_amount
      get :event_provided_tickets
      get :events_by_choice
      get :events_by_time
      get :per_event
      get :per_user
      get :per_room
      get :signup_spy
      get :volunteer_events
    end

    get 'mailing_lists' => 'mailing_lists#index'
    namespace :mailing_lists do
      get :event_proposers
      get :team_members
      get :users_with_pending_bio
      get :waitlists
      get :whos_free
    end

    resources :rooms, only: [:index]

    get 'staff_positions/(*extra)' => 'staff_positions#index', as: :staff_positions
    resources :forms, only: [:show]
    resources :admin_forms
  end

  # the following routes apply only when we're not in a virtual host
  resources :conventions
  resources :users
  root to: 'conventions#index'
end
