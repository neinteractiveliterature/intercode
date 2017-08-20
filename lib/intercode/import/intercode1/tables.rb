module Intercode::Import::Intercode1::Tables
  extend ActiveSupport::Autoload

  autoload :Bids
  autoload :BidTimes
  autoload :Bios
  autoload :Con
  autoload :Events
  autoload :GMs, 'intercode/import/intercode1/tables/gms'
  autoload :PriceSchedule
  autoload :Runs
  autoload :Rooms
  autoload :Signup
  autoload :Users
end
