class AddTeamMailingListNameToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :team_mailing_list_name, :text
  end
end
