class AddOrganizationToConventions < ActiveRecord::Migration[5.2]
  def change
    add_reference :conventions, :organization, foreign_key: true
  end
end
