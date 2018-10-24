class CreateDoorkeeperOpenidConnectTables < ActiveRecord::Migration[5.2]
  def change
    create_table :oauth_openid_requests do |t|
      t.references :access_grant, null: false, foreign_key: { to_table: :oauth_access_grants }
      t.string :nonce, null: false
    end
  end
end
