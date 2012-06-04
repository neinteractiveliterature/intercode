class DeviseCreateUsers < ActiveRecord::Migration
  def change
    create_table(:users) do |t|
      
      ## Intercode profile
      t.string :first_name,         :null => false
      t.string :last_name,          :null => false
      t.string :nickname
      t.date   :birth_date
      t.string :gender
      t.string :address1
      t.string :address2
      t.string :city
      t.string :state,              :length => 30
      t.string :zipcode,            :length => 10
      t.string :country
      t.string :day_phone
      t.string :evening_phone
      t.string :best_call_time
      t.string :preferred_contact
      
      ## Permissions
      t.boolean :site_admin
      
      ## Database authenticatable
      t.string :email,              :null => false, :default => ""
      t.string :encrypted_password, :null => false, :default => ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, :default => 0
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## Confirmable
      # t.string   :confirmation_token
      # t.datetime :confirmed_at
      # t.datetime :confirmation_sent_at
      # t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      # t.integer  :failed_attempts, :default => 0 # Only if lock strategy is :failed_attempts
      # t.string   :unlock_token # Only if unlock strategy is :email or :both
      # t.datetime :locked_at

      ## Token authenticatable
      # t.string :authentication_token


      t.timestamps
    end

    add_index :users, :email,                :unique => true
    add_index :users, :reset_password_token, :unique => true
    # add_index :users, :confirmation_token,   :unique => true
    # add_index :users, :unlock_token,         :unique => true
    # add_index :users, :authentication_token, :unique => true
  end
end
