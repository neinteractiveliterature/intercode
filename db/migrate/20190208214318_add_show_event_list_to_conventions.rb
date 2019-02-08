class AddShowEventListToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :show_event_list, :string, default: "no", null: false

    reversible do |dir|
      dir.up do
        execute "UPDATE conventions SET show_event_list = 'yes'"
      end
    end
  end
end
