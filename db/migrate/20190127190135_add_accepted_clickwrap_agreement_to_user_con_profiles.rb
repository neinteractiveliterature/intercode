class AddAcceptedClickwrapAgreementToUserConProfiles < ActiveRecord::Migration[5.2]
  def change
    add_column :user_con_profiles, :accepted_clickwrap_agreement, :boolean, null: false, default: false
  end
end
