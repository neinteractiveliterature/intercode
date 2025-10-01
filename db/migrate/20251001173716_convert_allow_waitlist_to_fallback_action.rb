class ConvertAllowWaitlistToFallbackAction < ActiveRecord::Migration[8.0]
  def change
    add_column :user_con_profiles, :ranked_choice_fallback_action, :text, default: "waitlist", null: false

    reversible do |dir|
      dir.up { execute <<~SQL }
          UPDATE user_con_profiles SET ranked_choice_fallback_action = (
            CASE ranked_choice_allow_waitlist
            WHEN true THEN 'waitlist'
            ELSE 'none'
            END
          )
        SQL

      dir.down { execute <<~SQL }
          UPDATE user_con_profiles SET ranked_choice_allow_waitlist = (ranked_choice_fallback_action = 'waitlist')
        SQL
    end

    remove_column :user_con_profiles, :ranked_choice_allow_waitlist, :boolean, default: true, null: false
  end
end
