class ConvertReceiveSignupEmailToString < ActiveRecord::Migration[5.2]
  def up
    add_column :team_members, :receive_signup_email_string, :string, null: false, default: 'no'
    exec_update <<~SQL, 'Calculate receive_signup_email string values'
      UPDATE team_members
      SET receive_signup_email_string = #{connection.quote('all_signups')}
      WHERE receive_signup_email = #{connection.quote(true)}
    SQL
    remove_column :team_members, :receive_signup_email
    rename_column :team_members, :receive_signup_email_string, :receive_signup_email
  end

  def down
    add_column :team_members, :receive_signup_email_boolean, :boolean, null: false, default: false
    exec_update <<~SQL, 'Calculate receive_signup_email boolean values'
      UPDATE team_members
      SET receive_signup_email_boolean = (
        receive_signup_email IS NOT NULL
        AND receive_signup_email != #{connection.quote('no')}
      )
    SQL
    remove_column :team_members, :receive_signup_email
    rename_column :team_members, :receive_signup_email_boolean, :receive_signup_email
  end
end
