class AddLegacyPasswordMd5ToUsers < ActiveRecord::Migration
  def change
    add_column :users, :legacy_password_md5, :text
  end
end
