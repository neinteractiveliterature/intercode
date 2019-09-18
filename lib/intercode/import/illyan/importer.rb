require 'sequel'

class Intercode::Import::Illyan::Importer
  attr_reader :connection, :emails, :organization_name

  def initialize(illyan_db_url, emails)
    logger.info('Connecting to Illyan database')
    @connection = Sequel.connect(illyan_db_url)
    @emails = emails
  end

  def import!
    people_table.import!
  end

  private

  def logger
    Intercode::Import::ImportLogger.instance
  end

  def people_table
    @people_table ||= Intercode::Import::Illyan::Tables::People.new(
      connection,
      emails
    )
  end
end
