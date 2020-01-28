class AddProposalDescriptionToEventCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :event_categories, :proposal_description, :text
  end
end
