require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
  use_doorkeeper_openid_connect
  use_doorkeeper

  get '/graphiql' => 'graphiql#show' if Rails.env.development?

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
    resources :user_con_profiles, only: [] do
      collection do
        post :revert_become
      end

      member do
        post :become
      end
    end

    namespace :reports do
      get :events_by_time
      get :per_event
      get :per_user
      get :per_room
      get 'user_con_profiles/:user_con_profile_id' => :single_user_printable
      get :volunteer_events
    end

    get 'calendars/user_schedule/:id' => 'calendars#user_schedule', as: :user_schedule

    namespace :csv_exports do
      get :event_proposals
      get :orders
      get :run_signup_changes
      get :run_signups
      get :signup_changes
      get :user_con_profiles
    end
  end

  get 'csv_exports/users' => 'csv_exports#users'
  get 'bundle_hash' => 'bundle_hash#show'

  get '/(*extra)' => 'single_page_app#root', as: :root, constraints: {
    extra: %r{(?!(uploads|packs|assets)/).*}
  }
end
