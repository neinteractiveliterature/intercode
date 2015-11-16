namespace :import do
  desc "Import an Intercode 1 database as an event"
  task :intercode1 => :environment do
    def fetch_env_param(name)
      value = ENV[name]

      unless value.present?
        puts "Please specify the variable #{name}"
        exit!
      end

      value
    end

    require 'intercode/import/intercode1'

    importer = Intercode::Import::Intercode1::Importer.from_constants_file(
      fetch_env_param('CONSTANTS_FILE')
    )

    importer.con_domain = fetch_env_param('CON_DOMAIN')

    # importer = Intercode::Import::Intercode1::Importer.new(
    #   Sequel.connect(fetch_env_param('INTERCODE1_DATABASE_URL')),
    #   fetch_env_param('CON_NAME'),
    #   fetch_env_param('CON_DOMAIN'),
    #   Date.parse(fetch_env_param('FRIDAY_DATE'))
    # )

    ActiveRecord::Base.connection.transaction do
      importer.import!
    end
  end
end