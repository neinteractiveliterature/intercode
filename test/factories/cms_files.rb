# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :cms_file do
    file { Rack::Test::UploadedFile.new(File.expand_path('test/files/war_bond.png', Rails.root), 'image/png') }
    association :parent, factory: :convention
    association :uploader, factory: :user
  end
end
