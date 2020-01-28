class CreateDepartments < ActiveRecord::Migration[6.0]
  def change
    create_table :departments do |t|
      t.references :convention, null: false, foreign_key: true
      t.text :name
      t.text :proposal_description

      t.timestamps
    end
  end
end
