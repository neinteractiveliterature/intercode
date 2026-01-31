#!/usr/bin/env ruby
# frozen_string_literal: true

# Creates or updates a test user for Playwright tests
# Usage: rails runner playwright-tests/helpers/create_test_user.rb \
#        [email] [password] [convention_domain] [permission1] [permission2] ...
#
# Examples:
#   # Grant update_convention permission
#   rails runner create_test_user.rb user@example.com password123 mycon.test update_convention
#
#   # Grant multiple permissions
#   rails runner create_test_user.rb user@example.com password123 mycon.test update_convention read_schedule
#
#   # No permissions (just create the user)
#   rails runner create_test_user.rb user@example.com password123 mycon.test

email = ARGV[0] || ENV["TEST_EMAIL"] || "playwright-test@example.com"
password = ARGV[1] || ENV["TEST_PASSWORD"] || "TestPassword123!"
convention_domain = ARGV[2] || raise("Convention domain is required")
# Any additional arguments are treated as permissions
requested_permissions = ARGV[3..] || []

# Find or create the user
user = User.find_or_initialize_by(email: email)

if user.new_record?
  user.first_name = "Playwright"
  user.last_name = "Test"
  user.password = password
  user.password_confirmation = password
  user.save!
  puts "Created new test user: #{email}"
else
  # Update password in case it changed
  user.password = password
  user.password_confirmation = password
  user.save!
  puts "Updated existing test user: #{email}"
end

# Find the convention
convention = Convention.find_by(domain: convention_domain)

if convention.nil?
  puts "WARNING: Convention with domain #{convention_domain} not found"
  puts "Available conventions:"
  Convention.limit(5).each { |c| puts "  - #{c.domain}" }
  exit 0
end

# Ensure user has a profile for this convention
profile = UserConProfile.find_or_initialize_by(user_id: user.id, convention_id: convention.id)

if profile.new_record?
  profile.first_name = user.first_name
  profile.last_name = user.last_name
  profile.save!
  puts "Created convention profile for #{email}"
else
  puts "Convention profile already exists for #{email}"
end

# Grant permissions if any were requested
if requested_permissions.any?
  staff_position = convention.staff_positions.find_or_create_by!(name: "Playwright Test Staff")

  # Create each requested permission
  requested_permissions.each do |permission_name|
    if staff_position.permissions.exists?(permission: permission_name)
      puts "Staff position already has #{permission_name} permission"
    else
      staff_position.permissions.create!(permission: permission_name)
      puts "Granted #{permission_name} permission to staff position"
    end
  end

  # Associate the user with the staff position
  if profile.staff_positions.include?(staff_position)
    puts "User already has staff permissions"
  else
    profile.staff_positions << staff_position
    puts "Granted staff permissions to #{email}"
  end
else
  puts "No permissions requested - user created without staff position"
end

puts "✓ Test user ready: #{email}"
