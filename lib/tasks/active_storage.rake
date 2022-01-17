namespace :active_storage do
  desc 'Migrate all attachments to use Active Storage'
  task migrate_attachments: :environment do
    columns_by_model = {
      CmsFile => %w[file],
      Convention => %w[favicon open_graph_image],
      Product => %w[image],
      ProductVariant => %w[image]
    }

    columns_by_model.each do |model_class, columns|
      puts '*' * 50

      puts "Start migrating #{model_class.count} #{model_class.name.pluralize}..."

      model_class.find_each do |model|
        columns.each do |column|
          next if model.public_send(column).blank? || model.public_send("as_#{column}").attached?
          model.public_send("sync_#{column}")
        end
      end

      puts "Completed migrating #{model_class.count} #{model_class.name.pluralize}"
      puts '*' * 50
    end
  end

  desc 'Rename as_* attachment names to finalize migration'
  task post_migration: :environment do
    columns_by_model = {
      CmsFile => %w[file],
      Convention => %w[favicon open_graph_image],
      Product => %w[image],
      ProductVariant => %w[image]
    }

    columns_by_model.each do |model_class, columns|
      columns.each do |column|
        sql = <<-SQL
          UPDATE active_storage_attachments
          SET name = #{ActiveRecord::Base.connection.quote(column)}
          WHERE name = #{ActiveRecord::Base.connection.quote("as_#{column}")}
          AND record_type = #{ActiveRecord::Base.connection.quote(model_class.name)}
        SQL

        ActiveRecord::Base.connection.execute(sql)
      end
    end
  end
end
