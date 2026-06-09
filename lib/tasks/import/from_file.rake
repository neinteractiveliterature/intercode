# frozen_string_literal: true

namespace :import do
  desc "Import a convention from a JSON export file (INPUT_FILE=convention-export.json, ORGANIZATION_NAME=optional)"
  task from_file: :environment do
    input_file = ENV["INPUT_FILE"].presence
    abort "Please set the INPUT_FILE environment variable" unless input_file
    abort "File not found: #{input_file}" unless File.exist?(input_file)

    data = JSON.parse(File.read(input_file), symbolize_names: true)

    organization_name = ENV["ORGANIZATION_NAME"].presence || data[:organization_name].presence
    organization = organization_name ? Organization.find_or_create_by!(name: organization_name) : nil

    puts "Importing convention: #{data.dig(:convention, :name)}"
    puts "  Domain:       #{data.dig(:convention, :domain)}"
    puts "  Source:       #{data[:source_system]}"
    puts "  Organization: #{organization_name || "(none)"}"
    puts "  Content set:  #{data[:cms_content_set] || "(none)"}"

    result = ImportConventionDataService.new(data: data, organization: organization).call!

    if result.success?
      puts "Import complete."
    else
      abort "Import failed: #{result.errors.full_messages.join(", ")}"
    end
  end
end
