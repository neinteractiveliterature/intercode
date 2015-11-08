class Intercode::Import::Intercode1::Importer
  attr_reader :connection

  def initialize(connection, con_name, con_domain, friday_date)
    @connection = connection
    @con_name = con_name
    @con_domain = con_domain
    @friday_date = friday_date
  end

  def import!
    con_table = Intercode::Import::Intercode1::Tables::Con.new(connection, @con_name, @con_domain, @friday_date)
    con = con_table.build_con
    con.save!
    Intercode::Import::Intercode1.logger.info("Imported con as ID #{con.id}")

    events_table = Intercode::Import::Intercode1::Tables::Events.new(connection, con)
    events_table.import!

    users_table = Intercode::Import::Intercode1::Tables::Users.new(connection, con, events_table.id_map)
    users_table.import!

    runs_table = Intercode::Import::Intercode1::Tables::Runs.new(connection, con, events_table.id_map, users_table.id_map)
    runs_table.import!
  end
end