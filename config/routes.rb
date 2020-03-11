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
  post '/sns_notifications', to: 'sns_notifications#create'

  # CMS stuff
  get 'liquid_docs/(*extra)' => 'liquid_docs#show', as: :liquid_docs

  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    resources :events, only: [] do
      resources :runs, only: [] do
        get 'admin_signups/export' => 'admin_signups#export', as: :export_admin_signups
      end
    end

    get(
      'admin_event_proposals/export' => 'admin_event_proposals#export',
      as: :export_admin_event_proposals
    )

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

    namespace :reports do
      get :export_signup_spy
      get :events_by_time
      get :per_event
      get :per_user
      get :per_room
      get 'user_con_profiles/:user_con_profile_id' => :single_user_printable
      get :volunteer_events
    end

    get 'calendars/user_schedule/:id' => 'calendars#user_schedule', as: :user_schedule
  end

  get 'users/export' => 'users#export', as: :export_users
  get 'bundle_hash' => 'bundle_hash#show'

  get '/(*extra)' => 'single_page_app#root', as: :root, constraints: {
    extra: %r{(?!(uploads|packs|assets)/).*}
  }
end
