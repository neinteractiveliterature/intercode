FactoryGirl.define do
  factory :user do
    first_name 'Test'
    last_name 'User'
    email 'test@example.com'
    password 'changeme'
    password_confirmation 'changeme'
  end

  factory :global_admin, parent: :user do
    site_admin true
  end

end