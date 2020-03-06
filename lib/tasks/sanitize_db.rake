require 'parallel'

class SanitizeDatabaseService < CivilService::Service
  attr_reader :dev_emails

  def initialize(dev_emails:)
    @dev_emails = Set.new(dev_emails)
  end

  private

  def inner_call
    Parallel.each(User.all, in_processes: Parallel.processor_count) do |user|
      puts "Sanitizing user #{user.id}"
      sanitize_user(user)
    end

    ActiveRecord::Base.connection.reconnect!

    scope = UserConProfile.includes(:user).all
    Parallel.each(scope, in_processes: Parallel.processor_count) do |user_con_profile|
      puts "Sanitizing user con profile #{user_con_profile.id}"

      sanitize_user_con_profile(user_con_profile)
    end

    puts 'Truncating security credential tables'
    [ActiveRecord::SessionStore::Session, Doorkeeper::AccessToken].each do |model|
      ActiveRecord::Base.connection.truncate(model.table_name)
    end

    success
  end

  def sanitize_user(user)
    if dev_emails.include?(user.email)
      user.update!(site_admin: true)
      return
    end

    first_name = Faker::Name.first_name

    user.update!(
      first_name: first_name,
      last_name: Faker::Name.last_name,
      email: Faker::Internet.safe_email(name: "#{first_name}#{user.id}"),
      password: 'password',
      legacy_password_md5: nil
    )
  end

  def sanitize_user_con_profile(user_con_profile)
    user = user_con_profile.user
    return if dev_emails.include?(user.email)

    sanitized_fields = {
      first_name: user.first_name,
      last_name: user.last_name,
      nickname: Faker::Lorem.word.titleize,
      birth_date: Faker::Time.between(from: Date.today - 70.years, to: Date.today - 16.years),
      address: Faker::Address.street_address(include_secondary: [true, false, false, false].sample),
      city: Faker::Address.city,
      state: Faker::Address.state_abbr,
      zipcode: Faker::Address.postcode,
      country: Faker::Address.country,
      day_phone: Faker::PhoneNumber.phone_number,
      evening_phone: Faker::PhoneNumber.phone_number,
      mobile_phone: Faker::PhoneNumber.phone_number,
      best_call_time: Faker::Lorem.sentence,
      ical_secret: Devise.friendly_token
    }

    sanitized_present_fields = sanitized_fields.select do |key, _|
      user_con_profile.public_send(key).present?
    end

    user_con_profile.update!(sanitized_present_fields)
  end
end

desc 'Sanitize the local copy of the database by anonymizing user data'
task sanitize_db: :environment do
  require 'faker'

  dev_emails = [
    'natbudin@gmail.com',
    'david@rigitech.com',
    'marleigh@mit.edu',
    'rwensley314@gmail.com',
    'dancesthroughlife@gmail.com',
    'hannahdotread@gmail.com'
  ]
  sanitizer = SanitizeDatabaseService.new(dev_emails: dev_emails)
  sanitizer.call!
end
