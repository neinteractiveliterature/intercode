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
  get '/authenticity_tokens', to: 'authenticity_tokens#show'

  # CMS stuff
  get 'liquid_docs/(*extra)' => 'liquid_docs#show', as: :liquid_docs

  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    get 'ticket/(*extra)' => 'tickets#show', as: :ticket

    resources :events, only: [] do
      resources :runs, only: [] do
        get 'admin_signups/export' => 'admin_signups#export', as: :export_admin_signups
      end
    end
    get 'events/:id/(*extra)' => 'events#show', as: :event, constraints: { id: /\d+(-[a-z0-9\-]*)?/ }
    get 'events/(*extra)' => 'events#index', as: :events

    get(
      'admin_event_proposals/export' => 'admin_event_proposals#export',
      as: :export_admin_event_proposals
    )

    resources :products, only: [:show]
    resource :cart, only: [:show]
    resource :order_history, only: [:show]
    get 'admin_store/orders/export' => 'admin_orders#export', as: :export_admin_orders

    resources :user_con_profiles, only: [] do
      collection do
        get :export
        post :revert_become
      end

      member do
        post :become
      end
    end
    get 'my_profile/new' => 'my_profiles#new', as: :new_my_profile
    get 'my_profile/edit' => 'my_profiles#show', as: :edit_my_profile # yes, really, show
    get 'my_profile/(*extra)' => 'my_profiles#show', as: :my_profile

    namespace :reports do
      get :export_signup_spy
      get :events_by_time
      get :per_event
      get :per_user
      get :per_room
      get 'user_con_profiles/:user_con_profile_id' => :single_user_printable
      get :volunteer_events
    end

    resource :clickwrap_agreement, only: [:show] do
      post :accept
    end

    get 'user_activity_alerts/(*extra)' => 'user_activity_alerts#index', as: :user_activity_alerts

    get 'calendars/user_schedule/:id' => 'calendars#user_schedule', as: :user_schedule
  end

  # the following routes apply only when we're not in a virtual host
  resource :root_site, only: [:show]
  get 'organizations/(*extra)' => 'organizations#index', as: :organizations
  get 'users/export' => 'users#export', as: :export_users
  get 'users/(*extra)' => 'users#index', as: :users

  get '/(*extra)' => 'single_page_app#root', as: :root, constraints: {
    extra: %r{(?!(uploads|packs|assets)/).*}
  }
end
