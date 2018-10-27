class AddTeamMailingListNameToEventProposals < ActiveRecord::Migration[5.2]
  def change
    add_column :event_proposals, :team_mailing_list_name, :text

    reversible do |dir|
      dir.up do
        EventProposal.find_each do |event_proposal|
          next unless event_proposal.additional_info['team_mailing_list_name'].present?
          event_proposal.update!(
            team_mailing_list_name: event_proposal.additional_info['team_mailing_list_name'],
            additional_info: event_proposal.additional_info.except('team_mailing_list_name')
          )
        end
      end

      dir.down do
        EventProposal.find_each do |event_proposal|
          next unless event_proposal.team_mailing_list_name.present?
          event_proposal.update!(additional_info: event_proposal.additional_info.merge(
            'team_mailing_list_name' => event_proposal.team_mailing_list_name
          ))
        end
      end
    end
  end
end
