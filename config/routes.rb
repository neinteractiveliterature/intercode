# == Route Map
#

require "intercode/virtual_host_constraint"

Intercode::Application.routes.draw do
  use_doorkeeper_openid_connect
  use_doorkeeper

  get "/graphiql" => "graphiql#show" if Rails.env.development?

  post "/graphql", to: "graphql#execute"
  devise_for :users, controllers: { passwords: "passwords", registrations: "registrations", sessions: "sessions" }
  get "/authenticity_tokens", to: "authenticity_tokens#show"
  post "/sns_notifications", to: "sns_notifications#create"
  post "/stripe_webhook/account", to: "stripe_webhooks#account"
  post "/stripe_webhook/connect", to: "stripe_webhooks#connect"

  get "/healthz" => "health#healthz"

  # CMS stuff
  get "liquid_docs/(*extra)" => "liquid_docs#show", :as => :liquid_docs

  direct :cdn_upload do |model, options|
    if model.respond_to?(:signed_id)
      route_for(
        :rails_service_blob_proxy,
        model.signed_id,
        model.filename,
        options.merge(host: ENV.fetch("UPLOADS_HOST", nil))
      )
    else
      signed_blob_id = model.blob.signed_id
      variation_key = model.variation.key
      filename = model.blob.filename

      route_for(
        :rails_blob_representation_proxy,
        signed_blob_id,
        variation_key,
        filename,
        options.merge(host: ENV.fetch("UPLOADS_HOST", nil))
      )
    end
  end

  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    resources :user_con_profiles, only: [] do
      collection { post :revert_become }

      member { post :become }
    end

    namespace :reports do
      get :events_by_time
      get :per_event
      get :per_user
      get :per_room
      get "user_con_profiles/:user_con_profile_id" => :single_user_printable
      get :volunteer_events
    end

    get "calendars/user_schedule/:id" => "calendars#user_schedule", :as => :user_schedule

    namespace :csv_exports do
      get :coupons
      get :event_proposals
      get :orders
      get :run_signup_changes
      get :run_signups
      get :runs
      get :signup_changes
      get :user_con_profiles
    end

    get "stripe_account/return" => "stripe_account#return", :as => :stripe_account_return
    get "stripe_account/refresh" => "stripe_account#refresh", :as => :stripe_account_refresh
  end

  get "csv_exports/users" => "csv_exports#users"
  get "/sitemap.xml" => "sitemaps#show"

  get "/(*extra)" => "single_page_app#root",
      :as => :root,
      :constraints => {
        extra: %r{(?!(rails/active_storage|uploads|packs|assets)/).*}
      }
end
