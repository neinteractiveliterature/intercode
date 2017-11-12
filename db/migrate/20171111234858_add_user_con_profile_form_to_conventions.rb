class AddUserConProfileFormToConventions < ActiveRecord::Migration[5.1]
  def change
    add_reference :conventions, :user_con_profile_form, foreign_key: { to_table: 'forms' }
  end
end
