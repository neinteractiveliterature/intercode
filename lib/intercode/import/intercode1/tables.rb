module Intercode::Import::Intercode1::Tables
  extend ActiveSupport::Autoload

  autoload :Con
  autoload :Events
  autoload :GMs, 'intercode/import/intercode1/tables/gms'
  autoload :Runs
  autoload :Rooms
  autoload :Signup
  autoload :Users
end