class CreateTicketTypes < ActiveRecord::Migration
  def change
    create_table :ticket_types do |t|
      t.references :convention, index: true, foreign_key: true
      t.text :name
      t.text :description
      t.json :pricing_schedule

      t.timestamps null: false
    end
  end
end
