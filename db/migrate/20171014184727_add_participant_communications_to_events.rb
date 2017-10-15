class AddParticipantCommunicationsToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :participant_communications, :text
  end
end
