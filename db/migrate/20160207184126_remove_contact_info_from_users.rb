class RemoveContactInfoFromUsers < ActiveRecord::Migration[4.2]
  def change
    remove_column "users", "nickname", :string
    remove_column "users", "birth_date", :date
    remove_column "users", "gender", :string
    remove_column "users", "address1", :string
    remove_column "users", "address2", :string
    remove_column "users", "city", :string
    remove_column "users", "state", :string
    remove_column "users", "zipcode", :string
    remove_column "users", "country", :string
    remove_column "users", "day_phone", :string
    remove_column "users", "evening_phone", :string
    remove_column "users", "best_call_time", :string
    remove_column "users", "preferred_contact", :string
  end
end
