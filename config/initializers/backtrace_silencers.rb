# Be sure to restart your server when you modify this file.

# It's confusing to see virtual_host_constraint.rb as the only line in the backtrace when in fact the exception
# is coming from a gem.  Silence it as if it was framework.
Rails.backtrace_cleaner.add_silencer { |line| line =~ /virtual_host_constraint\.rb/ }

# You can also remove all the silencers if you're trying to debug a problem that might stem from framework code.
# Rails.backtrace_cleaner.remove_silencers!
