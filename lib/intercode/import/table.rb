class Intercode::Import::Table
  attr_reader :connection, :id_map

  class << self
    attr_reader :after_create_record_callback

    def after_create_record(&block)
      @after_create_record_callback = block
    end
  end

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

      if self.class.after_create_record_callback
        instance_exec(row, record, &self.class.after_create_record_callback)
      end
    end
  end

  private

  def build_record(row)
  end

  def row_id(row)
  end

  def logger
    Intercode::Import::ImportLogger.instance
  end
end
