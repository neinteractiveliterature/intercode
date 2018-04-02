class Intercode::Import::Intercode1::Table
  attr_reader :connection, :id_map

  def initialize(connection)
    @connection = connection
    @id_map = {}
  end

  def table_name
    self.class.name.demodulize.to_sym
  end

  def dataset
    connection[table_name]
  end

  def object_name
    @object_name ||= self.class.name.demodulize.singularize
  end

  def import!
    logger.info "Importing #{object_name.pluralize}"
    dataset.each do |row|
      logger.debug "Importing #{object_name} #{row_id(row)}"
      record = build_record(row)
      next unless record

      record.save!

      id_map[row_id(row)] = record
    end
  end

  private

  def build_record(row)
  end

  def row_id(row)
  end

  def logger
    Intercode::Import::Intercode1.logger
  end

  def yesno_to_bool(value)
    case value
    when 'Yes' then true
    when 'No' then false
    else raise "Invalid yes/no value: #{value.inspect}"
    end
  end

  def yn_to_bool(value)
    case value
    when 'Y' then true
    when 'N' then false
    else raise "Invalid y/n value: #{value.inspect}"
    end
  end
end
