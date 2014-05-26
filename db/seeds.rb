# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

puts 'Default Users'

user = User.find_or_create_by!(:email => ENV['ADMIN_EMAIL'].dup) do |user|
    user.first_name = 'Admin'
    user.last_name = 'User'
    user.password = ENV['ADMIN_PASSWORD'].dup
    user.password_confirmation = ENV['ADMIN_PASSWORD'].dup
    user.site_admin = true
  end

puts 'user: ' << user.email

puts 'Default Convention'

convention = Convention.find_or_create_by(:domain => 'test.convention') do |convention|
  convention.title = 'Test Convention'
end

puts 'convention: ' << convention.domain