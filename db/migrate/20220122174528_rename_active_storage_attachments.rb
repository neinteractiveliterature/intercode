class RenameActiveStorageAttachments < ActiveRecord::Migration[7.0]
  COLUMNS_BY_MODEL = {
    'CmsFile' => %w[file],
    'Convention' => %w[favicon open_graph_image],
    'Product' => %w[image],
    'ProductVariant' => %w[image]
  }

  def change
    COLUMNS_BY_MODEL.each do |model_name, columns|
      columns.each do |column|
        reversible do |dir|
          dir.up do
            sql = <<-SQL
              UPDATE active_storage_attachments
              SET name = #{ActiveRecord::Base.connection.quote(column)}
              WHERE name = #{ActiveRecord::Base.connection.quote("as_#{column}")}
              AND record_type = #{ActiveRecord::Base.connection.quote(model_name)}
            SQL

            execute(sql)
          end

          dir.down do
            sql = <<-SQL
              UPDATE active_storage_attachments
              SET name = #{ActiveRecord::Base.connection.quote("as_#{column}")}
              WHERE name = #{ActiveRecord::Base.connection.quote(column)}
              AND record_type = #{ActiveRecord::Base.connection.quote(model_name)}
            SQL

            execute(sql)
          end
        end
      end
    end
  end
end
