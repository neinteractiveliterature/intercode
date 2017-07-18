class CreateTicketTypes < ActiveRecord::Migration[5.1]
  def change
    create_table :ticket_types do |t|
      t.references :convention, index: true, foreign_key: true
      t.text :name
      t.text :description
      t.column :pricing_schedule, :text

      t.timestamps null: false
    end
  end
end
