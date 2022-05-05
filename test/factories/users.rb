# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: users
#
#  id                        :bigint           not null, primary key
#  current_sign_in_at        :datetime
#  current_sign_in_ip        :string
#  email                     :string           default(""), not null
#  encrypted_password        :string           default(""), not null
#  first_name                :string           not null
#  last_name                 :string           not null
#  last_sign_in_at           :datetime
#  last_sign_in_ip           :string
#  legacy_password_md5       :text
#  legacy_password_sha1      :text
#  legacy_password_sha1_salt :text
#  remember_created_at       :datetime
#  reset_password_sent_at    :datetime
#  reset_password_token      :string
#  sign_in_count             :integer          default(0)
#  site_admin                :boolean
#  created_at                :datetime
#  updated_at                :datetime
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :user do
    sequence(:first_name) { |n| "Firstname#{n}" }
    last_name { 'Lastname' }

    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password' }

    factory :site_admin do
      site_admin { true }
    end
  end
end
