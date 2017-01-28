class RemovePaymentColumnsFromUserConProfiles < ActiveRecord::Migration[4.2]
  def change
    remove_column :user_con_profiles, "registration_status", :string, default: "unpaid", null: false
    remove_foreign_key :user_con_profiles, column: 'comp_event_id'
    remove_column :user_con_profiles, "comp_event_id", :integer
    remove_column :user_con_profiles, "payment_amount_cents", :integer
    remove_column :user_con_profiles, "payment_amount_currency", :string
    remove_column :user_con_profiles, "payment_note", :text
  end
end
