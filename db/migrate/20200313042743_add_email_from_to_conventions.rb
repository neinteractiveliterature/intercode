class AddEmailFromToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :email_from, :text

    reversible do |dir|
      dir.up do
        execute <<~SQL
          UPDATE conventions SET email_from = 'noreply@' || domain;
        SQL
      end
    end

    change_column_null :conventions, :email_from, false
  end
end
