class CreateVirtualHosts < ActiveRecord::Migration
  def change
    create_table :virtual_hosts do |t|
      t.references :con, :null => false
      t.string :domain, :null => false

      t.timestamps
    end
    
    add_index :virtual_hosts, :con_id
    add_index :virtual_hosts, :domain, :unique => true
  end
end
