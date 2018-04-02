class Intercode::Import::Intercode1::Tables::Rooms < Intercode::Import::Intercode1::Table
  def self.parse_legacy_column_definition(db_type)
    db_type.scan(/\'([^\']+)\'/).map(&:first)
  end

  def self.legacy_room_names_from_connection(connection)
    parse_legacy_column_definition(
      connection.schema(:Runs).find { |col| col.first == :Rooms }.second[:db_type]
    )
  end

  attr_reader :config

  def initialize(connection, con, config)
    super connection
    @con = con
    @config = config
  end

  def import!
    if connection.table_exists?(table_name)
      super
    else
      logger.info("Importing legacy rooms since table doesn't exist")
      self.class.legacy_room_names_from_connection(connection).each do |name|
        id_map[name] = @con.rooms.create!(name: name)
      end
    end
  end

  private

  def build_record(row)
    @con.rooms.new(name: row[:RoomName])
  end

  def row_id(row)
    row[:RoomId]
  end
end
