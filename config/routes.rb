require 'intercode/virtual_host_constraint'

Intercode::Application.routes.draw do
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
        get :schedule
      end

      resources :team_members, except: [:show]

      resources :runs, only: [] do
        resource :user_signup
        resources :admin_signups
      end
    end

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

    resources :staff_positions
    resources :forms
  end

  # the following routes apply only when we're not in a virtual host
  resources :conventions
  resources :users
  root :to => 'conventions#index'
end
