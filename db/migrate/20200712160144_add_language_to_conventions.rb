class AddLanguageToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :language, :string

    up_only do
      execute "UPDATE conventions SET language = 'en'"
    end

    change_column_null :conventions, :language, false
  end
end
