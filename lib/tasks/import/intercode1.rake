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
    importer.con = Convention.find_by(domain: ENV['CON_DOMAIN'])
    user_con_profiles_by_email = importer.con.user_con_profiles.includes(:user).to_a.index_by(&:email)
    user_con_profiles_id_map = {}
    importer.connection[:Users].each do |row|
      user_con_profiles_id_map[row[:UserId]] = user_con_profiles_by_email[row[:EMail].downcase]
    end
    importer.user_con_profiles_id_map = user_con_profiles_id_map

    ActiveRecord::Base.connection.transaction do
      importer.import_pre_con_content!
    end
  end
end
