class Intercode::Import::Intercode1::Tables::Rooms < Intercode::Import::Intercode1::Table
  def initialize(connection, con)
    super connection
    @con = con
  end

  private

  def build_record(row)
    @con.rooms.new(name: row[:RoomName])
  end

  def row_id(row)
    row[:RoomId]
  end
end
