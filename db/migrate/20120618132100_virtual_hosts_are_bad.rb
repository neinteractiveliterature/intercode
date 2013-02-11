class VirtualHostsAreBad < ActiveRecord::Migration
  class VirtualHost < ActiveRecord::Base
    belongs_to :con
  end
  
  def up
    add_column :cons, :domain, :string
    
    Con.reset_column_information
    
    if table_exists? :virtual_hosts
      VirtualHost.includes(:con).find_each do |vhost|
        con = vhost.con
        con.domain = vhost.domain
        con.save!
      end
    end
    
    change_column :cons, :domain, :string, :null => false
    add_index :cons, :domain, :unique => true
    drop_table :virtual_hosts if table_exists?(:virtual_hosts)
  end

  def down
    create_table "virtual_hosts", :force => true do |t|
      t.integer  "con_id",     :null => false
      t.string   "domain",     :null => false
      t.datetime "created_at", :null => false
      t.datetime "updated_at", :null => false
    end

    add_index "virtual_hosts", ["con_id"], :name => "index_virtual_hosts_on_con_id"
    add_index "virtual_hosts", ["domain"], :name => "index_virtual_hosts_on_domain", :unique => true
  end
end
