class CreateOrganizationRoles < ActiveRecord::Migration[5.2]
  def change
    create_table :organization_roles do |t|
      t.references :organization, foreign_key: true
      t.text :name

      t.timestamps
    end
  end
end
