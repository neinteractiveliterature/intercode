class AddMissingEventCategoryColors < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL
        UPDATE event_categories SET
          default_color = COALESCE(default_color, '#d4f5fa'),
          full_color = COALESCE(full_color, 'rgba(23, 162, 184, 0.7)'),
          signed_up_color = COALESCE(signed_up_color, '#17a2b8')
        SQL
      end
    end

    change_column_null :event_categories, :default_color, false
    change_column_null :event_categories, :full_color, false
    change_column_null :event_categories, :signed_up_color, false
  end
end
