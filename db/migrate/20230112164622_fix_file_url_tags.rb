class FixFileUrlTags < ActiveRecord::Migration[7.0]
  CMS_CONTENT_COLUMNS = { pages: "content", cms_partials: "content", cms_layouts: "content" }

  def up
    CMS_CONTENT_COLUMNS.each { |table_name, column_name| execute <<~SQL }
        UPDATE #{quote_table_name(table_name)}
        SET #{quote_column_name(column_name)} = regexp_replace(#{quote_column_name column_name}, #{quote %(\{%\\s*file_url\\s+([^'"]+[^'"\\s])\\s*%\})}, #{quote '{% file_url \'\1\' %}'}, 'g');
      SQL
  end

  def down
  end
end
