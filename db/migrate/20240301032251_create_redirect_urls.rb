class CreateRedirectUrls < ActiveRecord::Migration[7.1]
  def change
    create_table :redirect_urls do |t|
      t.references :domain, null: false, foreign_key: true
      t.text :path, null: false
      t.text :destination

      t.index %i[domain_id path], unique: true

      t.timestamps
    end
  end
end
