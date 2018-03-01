class AddAdditionalInfoToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :additional_info, :text

    reversible do |dir|
      dir.up { Event.update_all(additional_info: {}) }
    end
  end
end
