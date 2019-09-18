require 'intercode/import'

module Intercode
  module Import
    module Illyan
      extend ActiveSupport::Autoload

      autoload :Importer
      autoload :PasswordMigration
      autoload :Table
      autoload :Tables
    end
  end
end
