Intercode::Application.routes.draw do
  devise_for :users
  
  resources :cons
  
  root :to => 'cons#index'
end
