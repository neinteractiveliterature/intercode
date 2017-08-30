class AddEventProposalFormToConventions < ActiveRecord::Migration[5.1]
  def change
    add_reference :conventions, :event_proposal_form, foreign_key: { to_table: :forms }
  end
end
