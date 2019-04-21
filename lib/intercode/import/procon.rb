require 'intercode/import'

module Intercode
  module Import
    module Procon
      extend ActiveSupport::Autoload

      autoload :EventHelpers
      autoload :Importer
      autoload :Table
      autoload :Tables
      autoload :UserHelpers
    end
  end
end
