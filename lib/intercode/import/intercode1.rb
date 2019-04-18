require 'sequel'
require 'intercode/import/import_logger'

module Intercode
  module Import
    module Intercode1
      extend ActiveSupport::Autoload

      mattr_accessor :logger
      self.logger = ImportLogger.new

      autoload :Configuration
      autoload :DateHelpers
      autoload :EmbeddedPdfPage
      autoload :FormImporter
      autoload :HtmlContent
      autoload :HtmlConverter
      autoload :Importer
      autoload :LegacyTShirtImporter
      autoload :Markdownifier
      autoload :NavigationItems
      autoload :Php
      autoload :ProposalFormCustomizer
      autoload :RegistrationPolicyFactory
      autoload :RegistrationStatuses
      autoload :StaffPositionImporter
      autoload :Table
      autoload :Tables
      autoload :UploadFile
    end
  end
end
