def fetch_env_param(name)
  value = ENV[name]

  unless value.present?
    puts "Please specify the variable #{name}"
    exit!
  end

  value
end

namespace :import do
  desc 'Import an Intercode 1 database as a convention'
  task intercode1: :environment do
    require 'intercode/import/intercode1'

    importer = Intercode::Import::Intercode1::Importer.new(
      fetch_env_param('CONSTANTS_FILE'),
      ENV['CON_DOMAIN']
    )

    importer.build_password_hashes

    ActiveRecord::Base.connection.transaction do
      importer.import!
    end
  end

  task intercode1_precon: :environment do
    require 'intercode/import/intercode1'

    importer = Intercode::Import::Intercode1::Importer.new(
      fetch_env_param('CONSTANTS_FILE'),
      ENV['CON_DOMAIN']
    )

    ActiveRecord::Base.connection.transaction do
      importer.import_pre_con_content!
    end
  end
end
