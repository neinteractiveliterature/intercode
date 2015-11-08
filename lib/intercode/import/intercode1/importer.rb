class Intercode::Import::Intercode1::Importer
  attr_reader :connection, :con

  def initialize(connection, con_name, con_domain, friday_date)
    @connection = connection
    @con_name = con_name
    @con_domain = con_domain
    @friday_date = friday_date
  end

  def import!
    @con = con_table.build_con
    @con.save!
    Intercode::Import::Intercode1.logger.info("Imported con as ID #{@con.id}")

    events_table.import!
    users_table.import!
    runs_table.import!
    gms_table.import!
  end

  def con_table
    @con_table ||= Intercode::Import::Intercode1::Tables::Con.new(connection, @con_name, @con_domain, @friday_date)
  end

  def events_table
    @events_table ||= Intercode::Import::Intercode1::Tables::Events.new(connection, con)
  end

  def events_id_map
    @events_id_map ||= events_table.id_map
  end

  def users_table
    return unless events_id_map
    @users_table ||= Intercode::Import::Intercode1::Tables::Users.new(connection, con, events_id_map)
  end

  def users_id_map
    @users_id_map ||= users_table.id_map
  end

  def runs_table
    return unless events_id_map && users_id_map
    @runs_table ||= Intercode::Import::Intercode1::Tables::Runs.new(connection, con, events_id_map, users_id_map)
  end

  def gms_table
    return unless events_id_map && users_id_map
    @gms_table ||= Intercode::Import::Intercode1::Tables::GMs.new(connection, con, events_id_map, users_id_map)
  end
end