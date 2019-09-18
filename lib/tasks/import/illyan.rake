def fetch_env_param(name)
  value = ENV[name]

  unless value.present?
    puts "Please specify the variable #{name}"
    exit!
  end

  value
end

namespace :import do
  desc 'Import users from an Illyan database'
  task illyan: :environment do
    require 'intercode/import/illyan'

    importer = Intercode::Import::Illyan::Importer.new(
      fetch_env_param('ILLYAN_DB_URL'),
      fetch_env_param('EMAILS').strip.split(/\s+/)
    )

    ActiveRecord::Base.connection.transaction do
      importer.import!
    end
  end
end
