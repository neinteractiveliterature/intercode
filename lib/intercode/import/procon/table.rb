class Intercode::Import::Procon::Table < Intercode::Import::Table
  private

  def row_id(row)
    row[:id]
  end
end
