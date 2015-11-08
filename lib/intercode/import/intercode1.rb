require 'sequel'

module Intercode
  module Import
    module Intercode1
      extend ActiveSupport::Autoload

      mattr_accessor :logger
      self.logger = Logger.new(STDERR)
      self.logger.formatter = Proc.new do |severity, time, progname, msg|
        "%10s %s - %s\n" % ["[#{severity}]", time.strftime('%H:%M:%S.%L'), msg]
      end

      autoload :Importer
      autoload :Table
      autoload :Tables
    end
  end
end