class AddLegacyPasswordMd5ToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :legacy_password_md5, :text
  end
end
