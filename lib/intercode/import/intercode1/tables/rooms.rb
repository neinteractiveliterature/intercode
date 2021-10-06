class Intercode::Import::Intercode1::Tables::Rooms < Intercode::Import::Intercode1::Table
  def self.parse_legacy_column_definition(db_type)
    db_type.scan(/\'([^\']+)\'/).map(&:first)
  end

  def self.legacy_room_names_from_connection(connection)
    rooms_column = connection.schema(:Runs).find { |col| col.first == :Rooms }

    if rooms_column
      parse_legacy_column_definition(rooms_column.second[:db_type])
    else
      Intercode::Import::Intercode1.logger.info("Using Venue column values since Rooms column doesn't exist")
      venue_strings = connection[:Runs].pluck(:Venue)
      venue_strings.flat_map { |venue_string| venue_string.split(',').map(&:strip) }.uniq
    end
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
      self
        .class
        .legacy_room_names_from_connection(connection)
        .each { |name| id_map[name] = @con.rooms.create!(name: name) }
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
