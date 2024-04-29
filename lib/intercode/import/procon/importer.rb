require "sequel"

class Intercode::Import::Procon::Importer
  attr_reader :procon_connection, :illyan_connection, :convention_domain_regex, :organization_name

  def initialize(procon_db_url, illyan_db_url, convention_domain_regex, organization_name)
    logger.info("Connecting to ProCon database")
    @procon_connection = Sequel.connect(procon_db_url)

    logger.info("Connecting to Illyan database")
    @illyan_connection = Sequel.connect(illyan_db_url)

    @convention_domain_regex = Regexp.new(convention_domain_regex)
    @organization_name = organization_name
  end

  def import!
    %i[
      conventions_table
      people_table
      convention_staff_attendances_table
      proposed_events_table
      events_table
      attendances_table
    ].each { |importer| send(importer).import! }

    expand_conventions
  end

  private

  def logger
    Intercode::Import::ImportLogger.instance
  end

  def expand_conventions
    logger.info "Expanding convention times to fit all event runs"
    @conventions_table.id_map.values.each do |convention|
      next unless convention.runs.any?

      min_start = [convention.starts_at, *convention.runs.map(&:starts_at)].min
      max_end = [convention.ends_at, *convention.runs.map(&:ends_at)].max

      logger.debug "Expanding #{convention.name}"
      convention.update!(starts_at: min_start, ends_at: max_end)
    end
  end

  def organization
    @organization ||= Organization.find_or_create_by!(name: organization_name)
  end

  def conventions_table
    @conventions_table ||=
      Intercode::Import::Procon::Tables::Conventions.new(procon_connection, convention_domain_regex, organization)
  end

  def people_table
    @people_table ||= Intercode::Import::Procon::Tables::People.new(procon_connection, illyan_connection)
  end

  def convention_staff_attendances_table
    @convention_staff_attendances_table ||=
      Intercode::Import::Procon::Tables::ConventionStaffAttendances.new(
        # rubocop:disable Layout/LineLength
        procon_connection,
        conventions_table.id_map,
        people_table.id_map
      )
  end

  def proposed_events_table
    @proposed_events_table ||=
      Intercode::Import::Procon::Tables::ProposedEvents.new(
        procon_connection,
        conventions_table.id_map,
        people_table.id_map
      )
  end

  def events_table
    @events_table ||=
      Intercode::Import::Procon::Tables::Events.new(
        procon_connection,
        conventions_table.id_map,
        proposed_events_table.id_map
      )
  end

  def attendances_table
    @attendances_table ||=
      Intercode::Import::Procon::Tables::Attendances.new(
        procon_connection,
        conventions_table.id_map,
        people_table.id_map,
        events_table.id_map
      )
  end
end
