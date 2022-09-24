class FixEventEmailFormItemIdentifiers < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up { execute "UPDATE form_items SET identifier = 'event_email' WHERE item_type = 'event_email'" }
    end
  end
end
