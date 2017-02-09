require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
  devise_for :users, controllers: { registrations: "registrations" }

  # All of these pages must be within the virtual host
  constraints(Intercode::VirtualHostConstraint.new) do
    # all the /pages/* routes that Cadmus provides
    cadmus_pages

    # http://con.domain/ will go to the root page of the con
    root :to => 'pages#root', :as => 'con_root'

    resource :ticket, only: [:new, :show, :create]
    resources :ticket_types, except: [:show]

    resources :events do
      collection do
        get :schedule
      end

      resources :team_members, except: [:show]

      resources :runs, only: [] do
        resource :user_signup
        resources :admin_signups
      end
    end

    resources :user_con_profiles do
      member do
        post :become
      end

      resource :admin_ticket, only: [:new, :create, :edit, :update, :destroy]
    end

    resources :cms_partials

    resource :my_profile
  end

  # the following routes apply only when we're not in a virtual host
  resources :conventions
  resources :users
  root :to => 'conventions#index'
end
