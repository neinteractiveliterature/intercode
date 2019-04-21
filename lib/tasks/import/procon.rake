def fetch_env_param(name)
  value = ENV[name]

  unless value.present?
    puts "Please specify the variable #{name}"
    exit!
  end

  value
end

namespace :import do
  desc 'Import a ProCon database'
  task procon: :environment do
    require 'intercode/import/procon'

    importer = Intercode::Import::Procon::Importer.new(
      fetch_env_param('PROCON_DB_URL'),
      fetch_env_param('ILLYAN_DB_URL'),
      fetch_env_param('CONVENTION_DOMAIN_REGEX'),
      fetch_env_param('ORGANIZATION_NAME')
    )

    ActiveRecord::Base.connection.transaction do
      importer.import!
      # raise ActiveRecord::Rollback
      ActiveRecord::Base.connection.execute <<~SQL
        UPDATE conventions
        SET
          domain = regexp_replace(lower(name), '[^a-z0-9]', '', 'g') || '.intercode.test';
      SQL
    end
  end
end
