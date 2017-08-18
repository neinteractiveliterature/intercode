require 'sequel'
require 'term/ansicolor'

module Intercode
  module Import
    module Intercode1
      extend ActiveSupport::Autoload

      col = Term::ANSIColor

      mattr_accessor :logger
      self.logger = Logger.new(STDERR)
      self.logger.formatter = Proc.new do |severity, time, progname, msg|
        severity_padded = '%-7s' % ["[#{severity}]"]

        severity_rep = case severity
        when "FATAL" then col.black(col.on_red(severity_padded))
        when "ERROR" then col.bold(col.red(severity_padded))
        when "WARN" then col.bold(col.yellow(severity_padded))
        when "INFO" then col.bold(col.green(severity_padded))
        when "DEBUG" then col.dark(col.blue(severity_padded))
        else severity_padded
        end

        "#{severity_rep} #{col.dark(col.yellow(time.strftime('%H:%M:%S.%L')))} - #{msg}\n"
      end

      autoload :EmbeddedPdfPage
      autoload :HtmlContent
      autoload :HtmlConverter
      autoload :Importer
      autoload :Markdownifier
      autoload :NavigationItems
      autoload :Php
      autoload :ProposalForm
      autoload :RegistrationPolicyFactory
      autoload :StaffPositionImporter
      autoload :Table
      autoload :Tables
      autoload :UploadFile
    end
  end
end
