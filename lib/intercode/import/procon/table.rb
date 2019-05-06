class Intercode::Import::Procon::Table < Intercode::Import::Table
  def table_name
    self.class.name.demodulize.downcase.to_sym
  end

  private

  def row_id(row)
    row[:id]
  end
end
