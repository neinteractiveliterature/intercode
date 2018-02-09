class GeneralizeEventProposalChanges < ActiveRecord::Migration[5.1]
  def change
    rename_table :event_proposal_changes, :form_response_changes
    add_reference :form_response_changes, :response, polymorphic: true

    reversible do |dir|
      dir.up do
        execute "UPDATE form_response_changes SET response_type = 'EventProposal', response_id = event_proposal_id"
      end

      dir.down do
        execute 'UPDATE form_response_changes SET event_proposal_id = response_id'
      end
    end

    remove_reference :form_response_changes, :event_proposal, foreign_key: true, null: false
  end
end
