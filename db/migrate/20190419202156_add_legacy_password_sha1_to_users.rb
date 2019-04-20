class AddLegacyPasswordSha1ToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :legacy_password_sha1, :text
    add_column :users, :legacy_password_sha1_salt, :text
  end
end
