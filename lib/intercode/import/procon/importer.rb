require 'sequel'

class Intercode::Import::Procon::Importer
  attr_reader :procon_connection, :illyan_connection

  def initialize(procon_db_url, illyan_db_url)
    logger.info('Connecting to ProCon database')
    @procon_connection = Sequel.connect(procon_db_url)

    logger.info('Connecting to Illyan database')
    @illyan_connection = Sequel.connect(illyan_db_url)
  end

  def import!
    %i[
      conventions_table
      people_table
      convention_staff_attendances_table
      proposed_events_table
      events_table
      attendances_table
    ].each do |importer|
      send(importer).import!
    end
  end

  private

  def logger
    Intercode::Import::ImportLogger.instance
  end

  def conventions_table
    @conventions_table ||= Intercode::Import::Procon::Tables::Conventions.new(procon_connection)
  end

  def people_table
    @people_table ||= Intercode::Import::Procon::Tables::People.new(
      procon_connection,
      illyan_connection
    )
  end

  def convention_staff_attendances_table
    @convention_staff_attendances_table ||= Intercode::Import::Procon::Tables::ConventionStaffAttendances.new( # rubocop:disable Metrics/LineLength
      procon_connection,
      conventions_table.id_map,
      people_table.id_map
    )
  end

  def proposed_events_table
    @proposed_events_table ||= Intercode::Import::Procon::Tables::ProposedEvents.new(
      procon_connection,
      conventions_table.id_map,
      people_table.id_map
    )
  end

  def events_table
    @events_table ||= Intercode::Import::Procon::Tables::Events.new(
      procon_connection,
      conventions_table.id_map,
      proposed_events_table.id_map
    )
  end

  def attendances_table
    @attendances_table ||= Intercode::Import::Procon::Tables::Attendances.new(
      procon_connection,
      conventions_table.id_map,
      people_table.id_map,
      events_table.id_map
    )
  end
end
