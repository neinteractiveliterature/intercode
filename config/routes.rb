require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
  use_doorkeeper_openid_connect
  use_doorkeeper
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?

  post '/graphql', to: 'graphql#execute'
  devise_for :users, controllers: {
    passwords: 'passwords',
    registrations: 'registrations',
    sessions: 'sessions'
  }

  # CMS stuff
  cadmus_pages
  resources :cms_partials
  resources :cms_files
  get 'cms_graphql_queries/(*extra)' => 'cms_graphql_queries#index', as: :cms_graphql_queries
  resources :cms_navigation_items do
    collection do
      patch :sort
    end
  end
  resources :cms_layouts
  resources :cms_variables, only: [:index]
  get 'liquid_docs/(*extra)' => 'liquid_docs#show', as: :liquid_docs

  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    resource :convention, only: [:edit]

    resource :ticket, only: [:new, :show, :create]
    get 'ticket_types/(*extra)' => 'ticket_types#index', as: :ticket_types

    resources :events, only: [] do
      resources :runs, only: [] do
        get 'admin_signups/export' => 'admin_signups#export', as: :export_admin_signups
      end
    end
    get 'events/:id/(*extra)' => 'events#show', as: :event, constraints: { id: /\d+(-[a-z0-9\-]*)?/ }
    get 'events/(*extra)' => 'events#index', as: :events

    get 'event_categories/(*extra)' => 'event_categories#index', as: :event_categories
    get 'admin_events/(*extra)' => 'admin_events#index', as: :admin_events

    resources :event_proposals, except: [:update]
    get(
      'admin_event_proposals/export' => 'admin_event_proposals#export',
      as: :export_admin_event_proposals
    )
    get(
      'admin_event_proposals/(*extra)' => 'admin_event_proposals#index',
      as: :admin_event_proposals
    )

    resources :products, only: [:show]
    resource :cart, only: [:show]
    resource :order_history, only: [:show]
    get 'admin_store/orders/export' => 'admin_orders#export', as: :export_admin_orders
    get 'admin_store/(*extra)' => 'admin_store#index', as: :admin_store

    resources :user_con_profiles, only: [:index] do
      collection do
        get :export
        post :revert_become
      end

      member do
        post :become
      end

      resource :admin_ticket, only: [:new, :create, :edit, :update]
    end
    get 'user_con_profiles/(*extra)' => 'user_con_profiles#index'

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
      get 'user_con_profiles/:user_con_profile_id' => :single_user_printable
      get :volunteer_events
    end

    get 'mailing_lists' => 'mailing_lists#index'
    namespace :mailing_lists do
      get :event_proposers
      get :team_members
      get :ticketed_attendees
      get :users_with_pending_bio
      get :waitlists
      get :whos_free
    end

    resources :rooms, only: [:index]
    resource :clickwrap_agreement, only: [:show] do
      post :accept
    end

    get 'user_activity_alerts/(*extra)' => 'user_activity_alerts#index', as: :user_activity_alerts

    get 'staff_positions/(*extra)' => 'staff_positions#index', as: :staff_positions
    get 'admin_forms/(*extra)' => 'admin_forms#index', as: :admin_forms

    get 'calendars/user_schedule/:id' => 'calendars#user_schedule', as: :user_schedule
  end

  # the following routes apply only when we're not in a virtual host
  resource :root_site, only: [:show]
  root to: 'pages#root'
end
