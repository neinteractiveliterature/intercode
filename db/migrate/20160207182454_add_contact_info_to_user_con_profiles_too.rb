class AddContactInfoToUserConProfilesToo < ActiveRecord::Migration[4.2]
  class User < ApplicationRecord
    has_many :user_con_profiles, class_name: "AddContactInfoToUserConProfilesToo::UserConProfile"
  end

  class UserConProfile < ApplicationRecord
    belongs_to :user, class_name: "AddContactInfoToUserConProfilesToo::User"
  end

  def change
    change_table :user_con_profiles do |t|
      t.string :first_name
      t.string :last_name
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
    end

    reversible do |dir|
      dir.up do
        AddContactInfoToUserConProfilesToo::UserConProfile.includes(:user).find_each do |user_con_profile|
          user_con_profile.update!(
            user_con_profile.user.attributes.symbolize_keys.slice(
              :first_name,
              :last_name,
              :nickname,
              :birth_date,
              :gender,
              :address1,
              :address2,
              :city,
              :state,
              :zipcode,
              :country,
              :day_phone,
              :evening_phone,
              :best_call_time,
              :preferred_contact
            )
          )
        end

        change_column :user_con_profiles, :first_name, :string, null: false
        change_column :user_con_profiles, :last_name, :string, null: false
      end
    end
  end
end
